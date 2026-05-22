import NewProductButton from "@/components/product/new-product/new-product-button";
import ShopProductsList from "@/components/shop/shop-products-list";

export default async function ShopProducts() {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Product Catalog
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Products
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Manage the products visible in your storefront, update listings,
              and review what buyers can discover.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <NewProductButton />
          </div>
        </div>
      </section>

      <ShopProductsList />
    </div>
  );
}
