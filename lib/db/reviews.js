import { createClient } from "@/utils/supabase/server";

export async function addProductReview(reviewData) {
  const supabase = await createClient();

  const { error } = await supabase.from("reviews").insert([
    {
      user_id: reviewData.userId,
      product_id: reviewData.productId,
      rating: reviewData.rating,
      comment: reviewData.comment,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error(
      "Error while submitting the review. Please try again later!",
    );
  }
}

export async function addShopReview(reviewData) {
  const supabase = await createClient();

  const { error } = await supabase.from("reviews").insert([
    {
      user_id: reviewData.userId,
      seller_id: reviewData.sellerId,
      rating: reviewData.rating,
      comment: reviewData.comment,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error(
      "Error while submitting the review. Please try again later!",
    );
  }
}

export async function getProductReviews(productId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .is("seller_id", null);

  if (error) {
    console.error(error);
    throw new Error("Error retreiving reviews!");
  }

  return data;
}

export async function getShopReviews(sellerId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("seller_id", sellerId)
    .is("product_id", null);

  if (error) {
    console.error(error);
    throw new Error("Error retreiving reviews!");
  }

  return data;
}

export async function getAvgProductRating(productSlug) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_avg_product_rating", {
    p_product_slug: productSlug,
  });

  if (error) {
    console.error(error);
    throw new Error("Error retreiving product rating!");
  }

  return data[0];
}

export async function getAvgShopRating(shopSlug) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_avg_shop_rating", {
    p_shop_slug: shopSlug,
  });

  if (error) {
    console.error(error);
    throw new Error("Error retreiving shop rating!");
  }

  return data[0];
}
