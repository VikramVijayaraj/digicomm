import Image from "next/image";

import Quantity from "@/components/cart/quantity";
import AddToCart from "@/components/cart/add-to-cart";
import AddToFavourites from "@/components/cart/add-to-favourites";

export default function ProductPage() {
  return (
    <div className="">
      <div className="global-padding flex justify-between items-start space-x-10">
        {/* Image */}
        <div className="relative w-2/3 h-[40rem]">
          <Image
            src="https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            fill
          />
        </div>

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
    </div>
  );
}
