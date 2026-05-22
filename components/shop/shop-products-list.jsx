import { CalendarDays, IndianRupee, PackageOpen } from "lucide-react";

import { getShopProducts } from "@/lib/db/sellers";
import { dateConverter } from "@/utils/dateConverter";
import ShopProductActions from "./shop-product-actions";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { getStoragePath } from "@/utils/utils";

export default async function ShopProductsList() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const products = await getShopProducts(data?.user?.email);

  if (products.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
          <PackageOpen className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-slate-950">
          No products yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          Add your first product to start building your storefront catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid lg:grid-cols-[minmax(0,1fr)_160px_170px_56px] lg:items-center">
        <span>Product</span>
        <span>Price</span>
        <span>Updated</span>
        <span className="text-right">Menu</span>
      </div>

      <div className="divide-y divide-slate-200">
      {products.map((product) => {
        const imagePath = getStoragePath(
          product.images.length > 0 && product.images[0],
        ) || "/images/image-avatar.svg";

        return (
          <div
            key={product.product_id}
            className="grid gap-4 px-4 py-5 transition-colors hover:bg-slate-50/70 sm:px-5 lg:grid-cols-[minmax(0,1fr)_160px_170px_56px] lg:items-center"
          >
            <div className="flex min-w-0 items-start gap-4">
              <Link
                href={`/products/${product.product_slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-100"
              >
                  <Image
                    src={imagePath}
                  fill
                  className="object-cover"
                    alt={product.product_name}
                  unoptimized={!imagePath}
                  />
              </Link>

              <div className="min-w-0">
                <Link
                  href={`/products/${product.product_slug}`}
                  className="line-clamp-2 text-base font-semibold leading-6 text-slate-950 transition-colors hover:text-primary-brand"
                >
                  {product.product_name}
                </Link>
                <p className="mt-1 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
                  {product.category_name}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 lg:block">
              <span className="text-sm font-medium text-slate-500 lg:hidden">
                Price
              </span>
              <p className="flex items-center font-semibold text-slate-950">
                <IndianRupee className="mr-1 h-4 w-4" />
                {product.price}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 lg:block">
              <span className="text-sm font-medium text-slate-500 lg:hidden">
                Updated
              </span>
              <p className="flex items-center text-sm text-slate-500">
                <CalendarDays className="mr-2 h-4 w-4" />
                {dateConverter(product.updated_at)}
              </p>
            </div>

            <div className="flex justify-end">
              <ShopProductActions product={product} />
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
