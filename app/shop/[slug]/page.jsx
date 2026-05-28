import Image from "next/image";
import { PackageOpen, Store } from "lucide-react";

import { getShopBySlug, getShopProductsBySlug } from "@/lib/db/sellers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShopFeaturedProducts from "@/components/shop/shop-featured-products";
import ShopReviews from "@/components/product/reviews/shop-reviews";
import { getAvgShopRating } from "@/lib/db/reviews";
import AvgRatingContainer from "@/components/ui/avg-rating-container";
import { getStoragePath } from "@/utils/utils";

export default async function ShopPage({ params }) {
  const { slug } = params;

  const shop = await getShopBySlug(slug);
  const products = await getShopProductsBySlug(slug);
  const rating = await getAvgShopRating(slug);
  const bannerImagePath = getStoragePath(shop?.shop_banner);
  const logoImagePath = getStoragePath(shop?.shop_logo);

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden">
        <div className="relative h-[22rem] md:h-[28rem] lg:h-[34rem]">
          <Image
            src={bannerImagePath || "/images/shop-banner-default.jpg"}
            fill
            alt={`${shop.shop_name} Banner`}
            className="object-cover"
            unoptimized={!bannerImagePath}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="global-padding pb-8 md:pb-10">
              <div className="flex max-w-4xl flex-col gap-5 sm:flex-row sm:items-end">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.5rem] border-4 border-white bg-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] md:h-32 md:w-32">
                  <Image
                    src={logoImagePath || "/images/shop-avatar.png"}
                    alt={`${shop.shop_name} Logo`}
                    className="object-contain"
                    fill
                    unoptimized={!logoImagePath}
                  />
                </div>

                <div className="min-w-0 text-white">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur">
                    <Store className="h-4 w-4" />
                    Creator Storefront
                  </div>
                  <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                    {shop.shop_name}
                  </h1>

                  {rating.avg_rating > 0 && (
                    <div className="mt-4 inline-flex rounded-full bg-white px-3 py-2">
                      <AvgRatingContainer
                        avgRating={rating.avg_rating}
                        totalReviews={rating.total_reviews}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="global-padding min-h-screen space-y-8">
        <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              About The Shop
            </p>
            <p className="text-base leading-8 text-slate-700">
              {shop.shop_description ||
                "This shop has not added a description yet."}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_100%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
              <PackageOpen className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Products
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              {products.length}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Published products from this creator.
            </p>
          </div>
        </section>

        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="h-auto w-full rounded-full border border-slate-200 bg-slate-50 p-1">
            <TabsTrigger
              className="h-11 w-1/2 rounded-full text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
              value="products"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              className="h-11 w-1/2 rounded-full text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
              value="reviews"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-0">
            <ShopFeaturedProducts products={products} />
          </TabsContent>
          <TabsContent
            value="reviews"
            className="mt-0 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6"
          >
            <ShopReviews sellerId={shop.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
