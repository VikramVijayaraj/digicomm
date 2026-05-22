"use client";

import { Separator } from "@/components/ui/separator";

export default function CartTotal({
  subTotal,
  showTitle = true,
  currency = "₹",
}) {
  const formatAmount = (amount) =>
    `${currency}${Number(amount || 0).toFixed(2)}`;

  return (
    <div className="w-full">
      {showTitle && (
        <div className="mb-5">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Summary
          </p>
          <h4 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Cart total
          </h4>
        </div>
      )}

      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-semibold text-slate-950">
            {formatAmount(subTotal)}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Tax</span>
          <span className="font-semibold text-slate-950">
            {formatAmount(0)}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-slate-950">Total</span>
          <span className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
            {formatAmount(subTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
