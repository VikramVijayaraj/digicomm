import Link from "next/link";
import { MoveRight, ShoppingCart } from "lucide-react";

import { getCartItems, getGuestCart } from "@/lib/db/cart";
import OptimisticCart from "./optimistic-cart";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function CartPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  let cartItems = [];

  if (!data?.user) {
    const guestCart = await getGuestCart();
    cartItems = guestCart ? guestCart : [];
  } else {
    cartItems = await getCartItems(data?.user?.email);
  }

  const subTotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return (
    <div className="global-padding min-h-screen space-y-6 pb-10">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Your Cart
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Review your selected products, update quantities, and continue to
              secure checkout.
            </p>
          </div>

          {/* {cartItems.length > 0 && (
            <Button
              asChild
              className="h-12 w-full rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand md:w-auto"
            >
              <Link href="/your/cart/checkout">
                Proceed to checkout <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )} */}
        </div>
      </section>

      <OptimisticCart initialCartItems={cartItems} initialSubTotal={subTotal} />
    </div>
  );
}
