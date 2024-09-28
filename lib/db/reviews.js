import { sql } from "@vercel/postgres";

export async function addProductReview(reviewData) {
  try {
    await sql`
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES (${reviewData.userId}, ${reviewData.productId}, ${reviewData.rating}, ${reviewData.comment})
    `;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Error while submitting the review. Please try again later!",
    );
  }
}
