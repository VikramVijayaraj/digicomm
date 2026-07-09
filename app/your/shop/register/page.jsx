import { redirect } from "next/navigation";

import ShopDetailsForm from "@/components/shop/shop-details-form";
import { createClient } from "@/utils/supabase/server";

export default async function RegisterShop() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="global-padding space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Register your shop
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Create your public storefront to start selling your products.
            </p>
          </div>
        </div>
      </section>

      <ShopDetailsForm session={data} />
    </div>
  );
}
