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
    <>
      {/* Product quantity */}
      <Quantity
        quantity={quantity}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />

      {/* Add to cart button */}

      <Button
        onClick={() => AddToCartAction(slug, quantity)}
        className="flex items-center grow w-28 bg-primary rounded-sm select-none"
      >
        Add To Cart
      </Button>
    </>
  );
}
