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
import { supabaseAdmin } from "@/utils/supabase/admin";

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

export async function getAllSellersBankDetailsAction() {
  const { data, error } = await supabaseAdmin
    .from("seller_bank_details")
    .select("*");

  if (error) {
    console.error(error);
    throw new Error(
      "Error retrieving the sellers bank details. Try again later!",
    );
  }

  return data;
}
