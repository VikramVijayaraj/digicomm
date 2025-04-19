"use server";

// import { sql } from "@vercel/postgres";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createCartItem,
  createCartUserByEmail,
  removeProductFromCart,
} from "@/lib/db/cart";
import { getProduct } from "@/lib/db/products";

const sql = neon(process.env.DATABASE_URL);

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
  try {
    // await updateCartItemQuantity(productId, quantity);
    await sql`
      UPDATE cart_items
      SET quantity = ${quantity}
      WHERE cart_id = ${cartId} and product_id = ${productId};
    `;
    revalidatePath("/your/cart");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update the product quantity. Try again!");
  }
}
