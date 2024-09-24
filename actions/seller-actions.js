"use server";

import { createSeller, updateShopDetails } from "@/lib/db/sellers";

export async function createSellerAction(email, shopDetails) {
  await createSeller(email, shopDetails);
}

export async function updateSellerAction(email, shopDetails) {
  await updateShopDetails(email, shopDetails);
}
