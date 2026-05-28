import Link from "next/link";
import { PackageOpen, Plus } from "lucide-react";

import ProductCard from "@/components/card/product-card";
import { Button } from "../ui/button";

export default function ShopFeaturedProducts({ products }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Store Products
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            Featured Products
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Browse digital products published by this creator.
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
            <PackageOpen className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-slate-950">
            No products yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            This shop has not published products yet.
          </p>
          <Button
            asChild
            className="mt-6 h-12 rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
          >
            <Link href={`/your/shop/dashboard/products/new-product`}>
              <Plus className="mr-2 h-4 w-4" />
              New Product
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <Link
              href={`/products/${product.product_slug}`}
              key={product.product_id}
            >
              <ProductCard
                imgUrl={product.images[0]}
                name={product.product_name}
                category={product.category_name}
                price={product.price}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
