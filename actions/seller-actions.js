"use server";

import { revalidatePath } from "next/cache";

import {
  createSeller,
  createSellerBankDetails,
  getSellerDetails,
  getShopDetails,
  updateSellerBankDetails,
  updateShopDetails,
} from "@/lib/db/sellers";

export async function createSellerAction(email, shopDetails) {
  await createSeller(email, shopDetails);
  revalidatePath("/");
}

export async function updateSellerAction(email, shopDetails) {
  await updateShopDetails(email, shopDetails);
  revalidatePath("/");
}

export async function createSellerBankDetailsAction(email, bankDetails) {
  const { id: sellerId } = await getShopDetails(email);
  bankDetails["sellerId"] = sellerId;
  bankDetails["verificationStatus"] = "PENDING";

  await createSellerBankDetails(bankDetails);
  revalidatePath("/");
}

export async function updateSellerBankDetailsAction(email, bankDetails) {
  const { id: sellerId } = await getShopDetails(email);
  bankDetails["sellerId"] = sellerId;
  bankDetails["verificationStatus"] = "PENDING";

  await updateSellerBankDetails(bankDetails);
  revalidatePath("/");
}

export async function getSellerDetailsAction(orderItemId) {
  const sellerDetails = await getSellerDetails(orderItemId);
  return sellerDetails;
}
