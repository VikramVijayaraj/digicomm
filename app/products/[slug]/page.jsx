import { cache } from "react";
import Link from "next/link";
import { IndianRupee } from "lucide-react";

import AddToCart from "@/components/product/add-to-cart";
import AddToFavourites from "@/components/product/add-to-favourites";
import ProductImages from "@/components/product/product-images";
import { getProduct } from "@/lib/db/products";
import Reviews from "@/components/product/reviews/reviews";
import { getAvgProductRating } from "@/lib/db/reviews";
import AvgRatingContainer from "@/components/ui/avg-rating-container";
import { getCartItems } from "@/lib/db/cart";
import ShortDesc from "./short-desc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/server";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Cache the product data to avoid fetching it multiple times for the same slug when not using fetch
const currentProduct = cache(async (slug) => {
  const product = await getProduct(slug);
  return product;
});

export async function generateMetadata({ params }) {
  const { slug } = params;
  const result = await currentProduct(slug);

  const maxLength = 160;
  // Truncate description to fit within maxLength, accounting for ellipsis
  const description =
    result.product_desc.length > maxLength
      ? result.product_desc.substring(0, maxLength - 3) + "..."
      : result.product_desc;

  return {
    title: result.product_name,
    description: description,
    openGraph: {
      images: [
        {
          url: result.images[0],
        },
      ],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  const result = await currentProduct(slug);
  const rating = await getAvgProductRating(slug);

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const cartItems = data?.user ? await getCartItems(data?.user?.email) : [];

  return (
    <div className="global-padding scroll-smooth">
      <div
        className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0
          lg:space-x-10 pb-10"
      >
        {/* Image */}
        <ProductImages images={result.images} alt_texts={result.alt_texts} />

        {/* Info */}
        <div className="w-full lg:w-5/12 space-y-3">
          <h2 className="text-xl font-bold">{result.product_name}</h2>

          <AvgRatingContainer
            avgRating={rating.avg_rating}
            totalReviews={rating.total_reviews}
          />

          <p className="flex items-center text-2xl font-semibold">
            <IndianRupee />
            {result.price}
          </p>

          {/* Short Desciption */}
          <ShortDesc result={result} />

          {/* Actions */}
          <div className="py-4 space-y-8">
            {/* Add to cart */}
            <AddToCart product={result} initialCartItems={cartItems} />

            {/* Favourites */}
            {/* <AddToFavourites /> */}
          </div>

          {/* Shop Info */}
          <div className="select-none">
            <Link href={`/shop/${result.shop_slug}`}>
              <div className="flex justify-start items-center gap-4 rounded-lg border p-2">
                <Avatar>
                  <AvatarImage src={result.shop_logo} />
                  <AvatarFallback>{result.shop_name.at(0)}</AvatarFallback>
                </Avatar>

                <p>{result.shop_name}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div id="desc" className="py-12 space-y-4">
        <h3 className="text-2xl font-semibold select-none">
          Product Description
        </h3>
        <div>
          {result.product_desc
            .trim()
            .split(/\n\s*\n/) // split by empty lines (paragraphs)
            .map((para, idx, arr) => (
              // Have margin inbetween the paras expect the last one
              <p key={idx} className={idx === arr.length - 1 ? "" : "mb-4"}>
                {para.trim()}
              </p>
            ))}
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews productId={result.product_id} sellerId={result.seller_id} />
    </div>
  );
}
