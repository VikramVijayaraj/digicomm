"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createCartItem,
  createCartUserByEmail,
  removeProductFromCart,
} from "@/lib/db/cart";
import { getProduct } from "@/lib/db/products";

export default async function AddToCartAction(slug, quantity) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  let cartId;

  // Get Cart ID for the current user
  try {
    const result = await createCartUserByEmail(session.user.email);
    const { id } = result[0];
    cartId = id;
  } catch (error) {
    console.log(error);
    throw new Error("Cannot get cart information. Please try again later!");
  }

  // Get product ID for the current product
  let productId;
  try {
    const currentProduct = await getProduct(slug);
    const { product_id } = currentProduct[0];
    productId = product_id;
  } catch (error) {
    console.log(error);
    throw new Error("Cannot get product information. Please try again later!");
  }

  // Create new cart item
  try {
    await createCartItem(cartId, productId, quantity);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add the product to cart. Try again!");
  }

  revalidatePath("/your/cart");
  redirect("/your/cart");
}

export async function RemoveFromCartAction(productId) {
  await removeProductFromCart(productId);
  
  revalidatePath("/your/cart");
}
