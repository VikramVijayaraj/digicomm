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

export async function addShopReview(reviewData) {
  try {
    await sql`
      INSERT INTO reviews (user_id, seller_id, rating, comment)
      VALUES (${reviewData.userId}, ${reviewData.sellerId}, ${reviewData.rating}, ${reviewData.comment})
    `;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Error while submitting the review. Please try again later!",
    );
  }
}

export async function getProductReviews(productId) {
  try {
    const { rows } = await sql`
      SELECT * FROM reviews
      WHERE product_id = ${productId} and seller_id IS NULL;
    `;
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error("Error retreiving reviews!");
  }
}

export async function getShopReviews(sellerId) {
  try {
    const { rows } = await sql`
      SELECT * FROM reviews
      WHERE seller_id = ${sellerId} and product_id IS NULL;
    `;
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error("Error retreiving reviews!");
  }
}
