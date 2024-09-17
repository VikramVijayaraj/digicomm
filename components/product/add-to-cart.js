"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import Quantity from "./quantity";
import CartAction from "@/actions/cart-action";

export default function AddToCart() {
  const { slug } = useParams();

  const [quantity, setQuantity] = useState(1);

  function incrementQuantity() {
    setQuantity((q) => q + 1);
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  }

  return (
    <>
      {/* Product quantity */}
      <Quantity
        quantity={quantity}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />

      {/* Add to cart button */}
      <form
        action={() => CartAction(slug, quantity)}
        className="flex items-center grow w-28 bg-primary rounded-sm select-none"
      >
        <button
          className="cursor-pointer w-full h-full text-white text-sm hover:bg-primary-dark"
          type="submit"
        >
          Add To Cart
        </button>
      </form>
    </>
  );
}
