"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, IndianRupee, PackageOpen, ShoppingBag } from "lucide-react";

import { dateConverter } from "@/utils/dateConverter";
import { getStoragePath } from "@/utils/utils";

export default function OrdersListContainer({ orderData }) {
  if (!orderData?.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
          <PackageOpen className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-slate-950">
          No orders found
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          New purchases from your products will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid lg:grid-cols-[minmax(0,1fr)_140px_170px_150px] lg:items-center">
        <span>Order</span>
        <span>Quantity</span>
        <span>Ordered</span>
        <span className="text-right">Total</span>
      </div>

      <div className="divide-y divide-slate-200">
        {orderData.map((order) => {
          const imagePath =
            getStoragePath(order.product_image) || "/images/image-avatar.svg";
          const total = (Number(order.price) * order.quantity).toFixed(2);

          return (
            <Link
              href={`/your/shop/dashboard/order-details?order_id=${order.order_id}&item_id=${order.item_id}`}
              key={`${order.order_id}-${order.item_id}`}
              className="grid gap-4 px-4 py-5 transition-colors hover:bg-slate-50/70 sm:px-5 lg:grid-cols-[minmax(0,1fr)_140px_170px_150px] lg:items-center"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-100">
                  <Image
                    src={imagePath}
                    fill
                    alt={order.product_name || "Ordered product"}
                    className="object-cover"
                    unoptimized={!order.product_image}
                  />
                </div>

                <div className="min-w-0">
                  <p className="line-clamp-2 text-base font-semibold leading-6 text-slate-950">
                    {order.product_name}
                  </p>
                  <p className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {order.item_id}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 lg:block">
                <span className="text-sm font-medium text-slate-500 lg:hidden">
                  Quantity
                </span>
                <p className="flex items-center text-sm font-semibold text-slate-900">
                  <ShoppingBag className="mr-2 h-4 w-4 text-slate-500" />
                  {order.quantity}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 lg:block">
                <span className="text-sm font-medium text-slate-500 lg:hidden">
                  Ordered
                </span>
                <p className="flex items-center text-sm text-slate-500">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateConverter(order.order_date)}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 lg:justify-end">
                <span className="text-sm font-medium text-slate-500 lg:hidden">
                  Total
                </span>
                <p className="flex items-center justify-end font-semibold text-slate-950">
                  <IndianRupee className="mr-1 h-4 w-4" />
                  {total}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
