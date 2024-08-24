"use client";

import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

export default function Quantity() {
  const [quantity, setQuantity] = useState(0);

  function incrementQuantity() {
    setQuantity(quantity + 1);
  }

  function decrementQuantity() {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  }

  return (
    <div className="flex justify-between w-auto border border-gray-400 rounded-sm">
      <p
        className="cursor-pointer flex items-center justify-center w-8 hover:bg-primary hover:text-white"
        onClick={decrementQuantity}
      >
        <FaMinus />
      </p>
      <p className="flex items-center justify-center w-14 select-none">
        {quantity}
      </p>
      <p
        className="cursor-pointer flex items-center justify-center w-8 hover:bg-primary hover:text-white"
        onClick={incrementQuantity}
      >
        <FaPlus />
      </p>
    </div>
  );
}
