"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { nanoid } from "nanoid";

import {
  addProduct,
  addProductImage,
  deleteProductImage,
  getSearchSuggestions,
  updateProduct,
} from "@/lib/db/products";
import { getShopDetails } from "@/lib/db/sellers";

export async function SearchSuggestionsAction(searchTerm) {
  try {
    const result = await getSearchSuggestions(searchTerm);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function addProductAction(email, productDetails) {
  // Get Seller Id
  const { id: sellerId } = await getShopDetails(email);

  // Generate slug from product name
  const slug = slugify(productDetails.name) + "-" + nanoid(10);

  productDetails["seller"] = sellerId;
  productDetails["slug"] = slug;

  // Insert product details into products table and get product id
  const { id: productId } = await addProduct(productDetails);

  // Insert images into product_images table with the returned product id
  for (const image of productDetails.images) {
    await addProductImage(productId, image);
  }

  revalidatePath("/", "layout");
}

export async function updateProductAction(productId, productDetails) {
  // Generate slug from product name
  const slug = slugify(productDetails.name) + "-" + nanoid(10);
  productDetails["slug"] = slug;

  await updateProduct(productId, productDetails);

  // Insert images only if new images are uploaded
  if (productDetails.images.length > 0) {
    for (const image of productDetails.images) {
      await addProductImage(productId, image);
    }
  }

  revalidatePath("/", "layout");
}

export async function deleteProductImageAction(imageUrl) {
  await deleteProductImage(imageUrl);
  revalidatePath("/", "layout");
}
