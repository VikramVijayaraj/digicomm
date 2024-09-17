"use server";

import { auth } from "@/auth";
import {
  createCartItem,
  createCartUserByEmail,
  removeProductFromCart,
} from "@/lib/db/cart";
import { getProduct } from "@/lib/db/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function CartAction(slug, quantity) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Cannot verify your login. Please try again later!");
  }

  let cartId;
  let productId;

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
  try {
    const currentProduct = await getProduct(slug);
    const { id } = currentProduct[0];
    productId = id;
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

  revalidatePath("/cart");
  redirect("/cart", "push");
}

export async function RemoveFromCartAction(productId) {
  await removeProductFromCart(productId);

  revalidatePath("/cart");
}
