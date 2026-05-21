"use client";

import { Minus, Plus } from "lucide-react";

export default function Quantity({
  quantity,
  incrementQuantity,
  decrementQuantity,
}) {
  return (
    <div className="flex h-14 w-full items-center justify-between rounded-full border border-slate-200 bg-slate-50 p-1">
      <p
        className="flex w-12 cursor-pointer items-center justify-center rounded-full py-3 text-slate-700 transition-colors hover:bg-slate-900 hover:text-white"
        onClick={() => decrementQuantity()}
      >
        <Minus />
      </p>
      <p className="flex w-14 select-none items-center justify-center text-base font-semibold text-slate-900">
        {quantity}
      </p>
      <p
        className="flex w-12 cursor-pointer items-center justify-center rounded-full py-3 text-slate-700 transition-colors hover:bg-slate-900 hover:text-white"
        onClick={() => incrementQuantity()}
      >
        <Plus />
      </p>
    </div>
  );
}
