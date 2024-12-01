"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createCartItem,
  createCartUserByEmail,
  removeProductFromCart,
  updateCartItemQuantity,
} from "@/lib/db/cart";
import { getProduct } from "@/lib/db/products";
import { redirect } from "next/navigation";

export async function addToCartAction(slug, quantity) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/products/${slug}`);
    // throw new Error("User not authenticated");
  }

  let cartId;

  try {
    const result = await createCartUserByEmail(session.user.email);
    const { id } = result[0];
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

export async function removeFromCartAction(productId) {
  try {
    await removeProductFromCart(productId);
    revalidatePath("/your/cart");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to remove the product from cart. Try again!");
  }
}

export async function updateCartItemQuantityAction(productId, quantity) {
  try {
    await updateCartItemQuantity(productId, quantity);
    revalidatePath("/your/cart");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update the product quantity. Try again!");
  }
}
