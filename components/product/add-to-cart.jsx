"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import Quantity from "./quantity";
import { Button } from "../ui/button";
import AddToCartAction from "@/actions/cart-action";

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
    <div
      className="flex flex-col md:flex-row justify-between h-20 md:h-10 md:space-x-2 space-y-4
        md:space-y-0"
    >
      {/* Product quantity */}
      <Quantity
        quantity={quantity}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />

      {/* Add to cart button */}
      <Button
        onClick={() => AddToCartAction(slug, quantity)}
        className="flex items-center text-base grow w-full md:w-28 bg-primary rounded-sm
          select-none"
      >
        Add To Cart
      </Button>
    </div>
  );
}
