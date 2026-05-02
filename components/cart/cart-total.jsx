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
      {showTitle && <h4 className="font-semibold text-xl mb-4">Cart total</h4>}

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatAmount(subTotal)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">{formatAmount(0)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">{formatAmount(subTotal)}</span>
        </div>
      </div>
    </div>
  );
}
