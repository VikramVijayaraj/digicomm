import AddToCart from "@/components/product/add-to-cart";
import AddToFavourites from "@/components/product/add-to-favourites";
import ProductImages from "@/components/product/product-images";
import ProductReview from "@/components/product/product-review";
import { getProduct } from "@/lib/db/products";

export default async function ProductPage({ params }) {
  const result = await getProduct(params.slug);

  return (
    <div className="global-padding">
      <div className="flex justify-between items-start space-x-10 pb-10">
        {/* Image */}
        <ProductImages images={result} />

        {/* Info */}
        <div className="w-5/12 space-y-2">
          <h2 className="text-xl font-bold">{result[0].product_name}</h2>
          <p className="">Star Ratings</p>
          <p className="text-2xl">${result[0].price}</p>
          <p className="pt-4">{result[0].product_desc}</p>

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
              <AddToFavourites />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {/* <ProductReview /> */}
    </div>
  );
}
