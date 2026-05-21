import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

import { getCategories } from "@/lib/db/categories";
import ProductDetailsForm from "@/components/product/product-details-form";
import { createClient } from "@/utils/supabase/server";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const categories = await getCategories();

  return (
    <div className="space-y-6 pb-10">
      {/* <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/your/shop/dashboard" className="hover:text-slate-900">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/your/shop/dashboard/products"
          className="hover:text-slate-900"
        >
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">New Product</span>
      </div> */}

      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Create a marketplace-ready listing
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Add a new product
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Fill in the details to create your product listing. Make sure to
            provide accurate information and high-quality images to attract
            buyers.
          </p>
        </div>
      </section>

      <ProductDetailsForm session={data} categories={categories} />
    </div>
  );
}
