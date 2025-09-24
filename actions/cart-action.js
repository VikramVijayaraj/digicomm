"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createCartItem,
  createCartUserByEmail,
  removeProductFromCart,
} from "@/lib/db/cart";
import { getProduct } from "@/lib/db/products";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function addToCartAction(slug, quantity) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect(`/auth/signin?callbackUrl=/products/${slug}`);
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
