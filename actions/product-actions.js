"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { nanoid } from "nanoid";

import deleteFromFirebase from "@/utils/firebase";
import {
  addProduct,
  addProductFile,
  addProductImage,
  deleteProduct,
  deleteProductFile,
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

  // Insert files into product_files table with the returned product id
  for (const file of productDetails.files) {
    await addProductFile(productId, file);
  }

  revalidatePath("/", "layout");
}

export async function updateProductAction(productId, productDetails) {
  // Generate slug from product name
  productDetails["slug"] = slugify(productDetails.name) + "-" + nanoid(10);

  await updateProduct(productId, productDetails);

  // Insert into product_images table only if new images are uploaded
  if (productDetails.images.length > 0) {
    for (const image of productDetails.images) {
      await addProductImage(productId, image);
    }
  }

  // Insert into product_files table only if new files are uploaded
  if (productDetails.files.length > 0) {
    for (const file of productDetails.files) {
      await addProductFile(productId, file);
    }
  }

  revalidatePath("/", "layout");
}

export async function deleteProductAction(productDetails) {
  // Delete from firebase
  for (let image of productDetails.images) {
    await deleteFromFirebase(`product-images/${image}`);
  }
  for (let file of productDetails.files) {
    await deleteFromFirebase(`product-files/${file}`);
  }

  await deleteProduct(productDetails.product_id);
}

export async function deleteProductImageAction(imageUrl) {
  await deleteProductImage(imageUrl);
  revalidatePath("/", "layout");
}

export async function deleteProductFilesAction(fileUrl) {
  await deleteProductFile(fileUrl);
  revalidatePath("/", "layout");
}
