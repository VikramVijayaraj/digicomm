"use server";

import { revalidatePath } from "next/cache";

import { addProductReview } from "@/lib/db/reviews";
import { getUserByEmail } from "@/lib/db/users";

export async function addProductReviewAction(email, reviewData) {
  // Get userId
  const user = await getUserByEmail(email);
  const { id: userId } = user[0];

  reviewData["userId"] = userId;

  // Insert into reviews table
  await addProductReview(reviewData);
  revalidatePath("/product/[slug]", "page");
}
