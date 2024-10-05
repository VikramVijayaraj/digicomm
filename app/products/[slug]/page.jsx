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
import { auth } from "@/auth";

export default async function ProductPage({ params }) {
  const { slug } = params;

  const result = await getProduct(slug);
  const rating = await getAvgProductRating(slug);

  const session = await auth();
  const cartItems = session?.user ? await getCartItems(session.user.email) : [];

  return (
    <div className="global-padding">
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

          <p>{result.product_desc}</p>

          {/* Shop */}
          <div className="pt-4">
            <Link
              href={`/shop/${result.shop_slug}`}
              className="text-blue-700 hover:underline"
            >
              {result.shop_name}
            </Link>
          </div>

          {/* Actions */}
          <div className="py-4 space-y-8">
            {/* Add to cart */}
            <AddToCart product={result} initialCartItems={cartItems} />

            {/* Favourites */}
            {/* <AddToFavourites /> */}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews productId={result.product_id} sellerId={result.seller_id} />
    </div>
  );
}
