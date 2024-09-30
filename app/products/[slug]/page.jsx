import Link from "next/link";
import { IndianRupee } from "lucide-react";

import AddToCart from "@/components/product/add-to-cart";
import AddToFavourites from "@/components/product/add-to-favourites";
import ProductImages from "@/components/product/product-images";
import { getProduct } from "@/lib/db/products";
import Reviews from "@/components/product/reviews/reviews";
import StarRating from "@/components/ui/star-rating";

export default async function ProductPage({ params }) {
  const result = await getProduct(params.slug);

  return (
    <div className="global-padding">
      <div className="flex justify-between items-start space-x-10 pb-10">
        {/* Image */}
        <ProductImages images={result.images} alt_texts={result.alt_texts} />

        {/* Info */}
        <div className="w-5/12 space-y-2">
          <h2 className="text-xl font-bold">{result.product_name}</h2>
          <div className="">
            <StarRating disabled={true} />
          </div>
          <p className="flex items-center text-2xl">
            <IndianRupee />
            {result.price}
          </p>

          {/* Shop */}
          <p>
            <Link
              href={`/shop/${result.shop_slug}`}
              className="hover:underline"
            >
              {result.shop_name}
            </Link>
          </p>

          <p className="pt-4">{result.product_desc}</p>

          {/* Actions */}
          <div className="py-4 space-y-8">
            {/* Sizes */}
            {/* <div>
              <p>
                Sizes<span className="text-red-500">*</span>
              </p>
              <select className="w-full bg-gray-100 rounded-sm p-2 select-none">
                <option>sdf</option>
                <option>234</option>
                <option>ey58o</option>
              </select>
            </div> */}

            <div className="flex justify-between h-10 space-x-2">
              {/* Add to cart */}
              <AddToCart />

              {/* Favourites */}
              {/* <AddToFavourites /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews productId={result.product_id} sellerId={result.seller_id} />
    </div>
  );
}
