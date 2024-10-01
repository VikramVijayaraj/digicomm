"use client";

import { Minus, Plus } from "lucide-react";

export default function Quantity({
  quantity,
  width = "auto",
  incrementQuantity,
  decrementQuantity,
}) {
  return (
    <div
      className={`flex justify-between m-auto w-full md:w-${width} border border-gray-400
        rounded-sm h-full`}
    >
      <p
        className="cursor-pointer flex items-center justify-center w-8 hover:bg-primary
          hover:text-white"
        onClick={() => decrementQuantity()}
      >
        <Minus />
      </p>
      <p className="flex items-center justify-center w-14 select-none">
        {quantity}
      </p>
      <p
        className="cursor-pointer flex items-center justify-center w-8 hover:bg-primary
          hover:text-white"
        onClick={() => incrementQuantity()}
      >
        <Plus />
      </p>
    </div>
  );
}
