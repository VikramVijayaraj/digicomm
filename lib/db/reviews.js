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

export async function getAvgProductRating(productSlug) {
  try {
    const { rows } = await sql`
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating,
        COUNT(r.id) AS total_reviews
      FROM 
        products p
      LEFT JOIN 
        reviews r ON p.id = r.product_id
      WHERE 
        p.slug = ${productSlug}
      GROUP BY 
        p.id, p.name;
    `;
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error retreiving product rating!");
  }
}

export async function getAvgShopRating(shopSlug) {
  try {
    const { rows } = await sql`
      SELECT 
        s.id,
        s.shop_name,
        ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating,
        COUNT(r.id) AS total_reviews
      FROM 
        sellers s
      LEFT JOIN 
        reviews r ON s.id = r.seller_id
      WHERE 
        s.shop_slug = ${shopSlug}
      GROUP BY 
        s.id, s.shop_name;
    `;
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error retreiving shop rating!");
  }
}
