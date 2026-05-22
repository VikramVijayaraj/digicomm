"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { MoveRight, PackageOpen } from "lucide-react";

import CartItem from "@/components/cart/cart-item";
import CartTotal from "@/components/cart/cart-total";
import { Button } from "@/components/ui/button";

export default function OptimisticCart({ initialCartItems }) {
  const [optimisticCartItems, updateOptimisticCartItems] =
    useOptimistic(initialCartItems);
  const [, startTransition] = useTransition();

  const updateCartItems = (updateFn) => {
    startTransition(() => {
      updateOptimisticCartItems(updateFn);
    });
  };

  const subTotal = optimisticCartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  if (optimisticCartItems.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
          <PackageOpen className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-slate-950">
          Cart is empty
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          Products you add to cart will appear here.
        </p>
        <Button
          asChild
          className="mt-6 h-12 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid lg:grid-cols-[minmax(0,1fr)_130px_180px_130px_48px] lg:items-center">
          <span>Product</span>
          <span>Price</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Total</span>
          <span />
        </div>

        <div className="divide-y divide-slate-200">
          {optimisticCartItems.map((item) => (
            <CartItem
              key={item.product_id}
              data={item}
              updateCartItems={updateCartItems}
            />
          ))}
        </div>
      </section>

      <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] lg:sticky lg:top-24">
        <CartTotal subTotal={subTotal} />
        <Button
          asChild
          className="mt-6 h-12 w-full rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
        >
          <Link href="/your/cart/checkout">
            Proceed to checkout <MoveRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <p className="mt-4 text-center text-xs leading-5 text-slate-500">
          Secure checkout. Instant access after successful payment.
        </p>
      </aside>
    </div>
  );
}
