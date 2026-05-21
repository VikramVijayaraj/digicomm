import Link from "next/link";
import { ExternalLink, Store } from "lucide-react";

import { getShopDetails } from "@/lib/db/sellers";
import { createClient } from "@/utils/supabase/server";
import ShopDetailsForm from "@/components/shop/shop-details-form";
import CopyStoreUrlButton from "@/components/shop/copy-store-url-button";

export default async function ShopDashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const details = await getShopDetails(data?.user?.email);

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
              <Store className="h-4 w-4" />
              Seller workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Shop dashboard
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Manage your public shop profile, storefront visuals, and seller
              identity from one focused workspace.
            </p>
          </div>

          {details?.shop_slug && (
            <div className="flex flex-col items-start md:items-center gap-3">
              <Link
                href={`/shop/${details.shop_slug}`}
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                View storefront
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
              <CopyStoreUrlButton shopSlug={details.shop_slug} />
            </div>
          )}
        </div>
      </section>

      <ShopDetailsForm session={data} data={details} />
    </div>
  );
}
