"use client";

import { Minus, Plus } from "lucide-react";

export default function Quantity({
  quantity,
  incrementQuantity,
  decrementQuantity,
  disabled = false,
}) {
  return (
    <div
      className="flex h-14 w-full items-center justify-between rounded-full border border-slate-200 bg-slate-50 p-1"
      aria-label="Quantity"
      role="group"
    >
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700"
        onClick={decrementQuantity}
        disabled={disabled || quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus aria-hidden="true" className="h-4 w-4" />
      </button>
      <output
        className="flex w-14 select-none items-center justify-center text-base font-semibold text-slate-900"
        aria-live="polite"
      >
        {quantity}
      </output>
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700"
        onClick={incrementQuantity}
        disabled={disabled}
        aria-label="Increase quantity"
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
