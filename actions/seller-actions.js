"use server";

import { revalidatePath } from "next/cache";

import { createSeller, updateShopDetails } from "@/lib/db/sellers";

export async function createSellerAction(email, shopDetails) {
  await createSeller(email, shopDetails);
  revalidatePath("/");
}

export async function updateSellerAction(email, shopDetails) {
  await updateShopDetails(email, shopDetails);
  revalidatePath("/");
}
