"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { nanoid } from "nanoid";

import {
  addProduct,
  addProductImage,
  getSearchSuggestions,
} from "@/lib/db/products";
import { getShopDetails } from "@/lib/db/sellers";

export async function SearchSuggestionsAction(searchTerm) {
  try {
    const result = await getSearchSuggestions(searchTerm);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function addProductAction(email, productDetails) {
  // Get Seller Id
  const { id: sellerId } = await getShopDetails(email);

  // Generate slug from product name
  const slugFromName = slugify(productDetails.name);
  // Generate unique short id for slug
  const shortId = nanoid(10);

  const slug = slugFromName + "-" + shortId;

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
