"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  createCartItem,
  createCartUserByEmail,
  removeProductFromCart,
} from "@/lib/db/cart";
import { getProduct } from "@/lib/db/products";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
};

export async function addToCartAction(slug, quantity) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    // Guest cart
    await setGuestCartAction(slug, quantity);
    revalidatePath("/your/cart");
    return;
  }

  let cartId;

  try {
    const id = await createCartUserByEmail(data?.user.email);
    cartId = id;
  } catch (error) {
    console.log(error);
    throw new Error("Cannot get cart information. Please try again later!");
  }

  let productId;
  try {
    const { product_id } = await getProduct(slug);
    productId = product_id;
  } catch (error) {
    console.log(error);
    throw new Error("Cannot get product information. Please try again later!");
  }

  try {
    await createCartItem(cartId, productId, quantity);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add the product to cart. Try again!");
  }

  revalidatePath("/your/cart");
}

export async function removeFromCartAction(cartId, productId) {
  try {
    await removeProductFromCart(cartId, productId);
    revalidatePath("/your/cart");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to remove the product from cart. Try again!");
  }
}

export async function updateCartItemQuantityAction(
  cartId,
  productId,
  quantity,
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: quantity })
      .eq("cart_id", cartId)
      .eq("product_id", productId);

    if (error) {
      console.error(error);
      throw new Error("Failed to update the product quantity. Try again!");
    }

    revalidatePath("/your/cart");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update the product quantity. Try again!");
  }
}

export async function removeCartAction(cartId) {
  const { error } = await supabaseAdmin.from("carts").delete().eq("id", cartId);

  if (error) {
    console.error(error);
    throw new Error("Cannot remove cart!");
  }
}

// Guest Cart Actions

export async function setGuestCartAction(slug, quantity) {
  const { product_id, product_name: name, price } = await getProduct(slug);

  const cookieStore = await cookies();

  if (cookieStore.has("guest_cart")) {
    const existingCart = JSON.parse(cookieStore.get("guest_cart").value);

    // Check if the product is already in the cart
    const existingItemIndex = existingCart.findIndex(
      (item) => item.product_id === product_id,
    );

    if (existingItemIndex > -1) {
      // If the item already exists, update its quantity
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // If it's a new item, add it to the cart
      existingCart.push({ product_id, name, price, quantity });
    }

    cookieStore.set("guest_cart", JSON.stringify(existingCart), COOKIE_OPTIONS);
  } else {
    cookieStore.set(
      "guest_cart",
      JSON.stringify([{ product_id, name, price, quantity }]),
      COOKIE_OPTIONS,
    );
  }
}

export async function updateGuestCartItemAction(productId, quantity) {
  const cookieStore = await cookies();
  const guestCart = cookieStore.get("guest_cart");

  if (!guestCart) {
    throw new Error("No guest cart found!");
  }

  const cartData = JSON.parse(guestCart.value);

  const updatedCart = cartData.map((item) =>
    item.product_id === productId ? { ...item, quantity } : item,
  );

  cookieStore.set("guest_cart", JSON.stringify(updatedCart), COOKIE_OPTIONS);
}

export async function removeFromGuestCartAction(productId) {
  const cookieStore = await cookies();
  const guestCart = cookieStore.get("guest_cart");

  if (!guestCart) {
    throw new Error("No guest cart found!");
  }

  const cartData = JSON.parse(guestCart.value);
  const updatedCart = cartData.filter((item) => item.product_id !== productId);

  if (updatedCart.length === 0) {
    cookieStore.delete("guest_cart");
  } else {
    cookieStore.set("guest_cart", JSON.stringify(updatedCart), COOKIE_OPTIONS);
  }

  revalidatePath("/your/cart");
}
