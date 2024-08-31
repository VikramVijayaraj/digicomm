import Quantity from "@/components/product/quantity";
import AddToCart from "@/components/product/add-to-cart";
import AddToFavourites from "@/components/product/add-to-favourites";
import ProductImages from "@/components/product/product-images";
import ProductReview from "@/components/product/product-review";

export default function ProductPage() {
  return (
    <div className="global-padding">
      <div className="flex justify-between items-start space-x-10 py-10">
        {/* Image */}
        <ProductImages />

        {/* Info */}
        <div className="w-5/12 space-y-2">
          <h2 className="text-xl font-bold">MacBook M1 Pro</h2>
          <p className="">Star Ratings</p>
          <p className="text-2xl">$1999</p>
          <p className="pt-4">
            PlayStation 5 Controller Skin High quality vinyl with air channel
            adhesive for easy bubble free install & mess free removal Pressure
            sensitive.
          </p>

          {/* Actions */}
          <div className="py-4 space-y-8">
            {/* Sizes */}
            <div>
              <p>
                Sizes<span className="text-red-500">*</span>
              </p>
              <select className="w-full bg-gray-100 rounded-sm p-2 select-none">
                <option>sdf</option>
                <option>234</option>
                <option>ey58o</option>
              </select>
            </div>

            <div className="flex justify-between h-10 space-x-2">
              {/* Quantity */}
              <Quantity />

              {/* Add to cart */}
              <AddToCart />

              {/* Favourites */}
              <AddToFavourites />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReview />
    </div>
  );
}
