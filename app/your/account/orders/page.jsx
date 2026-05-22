import { CalendarDays, IndianRupee, PackageOpen, ReceiptText } from "lucide-react";

import { getOrders } from "@/lib/db/orders";
import { dateConverter } from "@/utils/dateConverter";
import OrderActions from "@/components/user/order-actions";
import { createClient } from "@/utils/supabase/server";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const orders = await getOrders(data?.user?.email);

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
            <ReceiptText className="h-4 w-4" />
            Purchase History
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            View purchased products, download files, and request support for an
            order when needed.
          </p>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
            <PackageOpen className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-950">
            No orders found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Your purchased products will appear here after checkout.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid lg:grid-cols-[minmax(0,1fr)_150px_150px_130px_56px] lg:items-center">
            <span>Product</span>
            <span>Ordered</span>
            <span>Price</span>
            <span>Total</span>
            <span className="text-right">Menu</span>
          </div>

          <div className="divide-y divide-slate-200">
            {orders.map((order) => {
              const total = (Number(order.price) * order.quantity).toFixed(2);

              return (
                <div
                  key={order.order_item_id}
                  className="grid gap-4 px-4 py-5 transition-colors hover:bg-slate-50/70 sm:px-5 lg:grid-cols-[minmax(0,1fr)_150px_150px_130px_56px] lg:items-center"
                >
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-base font-semibold leading-6 text-slate-950">
                      {order.product_name}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
                        {order.category_name}
                      </span>
                      <span className="text-sm text-slate-500">
                        Qty {order.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 lg:block">
                    <span className="text-sm font-medium text-slate-500 lg:hidden">
                      Ordered
                    </span>
                    <p className="flex items-center text-sm text-slate-500">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {dateConverter(order.order_placed_at)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 lg:block">
                    <span className="text-sm font-medium text-slate-500 lg:hidden">
                      Price
                    </span>
                    <p className="flex items-center font-semibold text-slate-950">
                      <IndianRupee className="mr-1 h-4 w-4" />
                      {order.price}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 lg:block">
                    <span className="text-sm font-medium text-slate-500 lg:hidden">
                      Total
                    </span>
                    <p className="flex items-center font-semibold text-slate-950">
                      <IndianRupee className="mr-1 h-4 w-4" />
                      {total}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <OrderActions order={order} userEmail={data?.user?.email} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
