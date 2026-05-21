import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  IndianRupee,
  ShieldCheck,
  Zap,
  Download,
} from "lucide-react";

import AddToCart from "@/components/product/add-to-cart";
import ProductImages from "@/components/product/product-images";
import { getProduct } from "@/lib/db/products";
import Reviews from "@/components/product/reviews/reviews";
import { getAvgProductRating } from "@/lib/db/reviews";
import AvgRatingContainer from "@/components/ui/avg-rating-container";
import { getCartItems } from "@/lib/db/cart";
import ShortDesc from "./short-desc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/server";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Cache the product data to avoid fetching it multiple times for the same slug when not using fetch
const currentProduct = cache(async (slug) => {
  const product = await getProduct(slug);
  return product;
});

export async function generateMetadata({ params }) {
  const { slug } = params;
  const result = await currentProduct(slug);

  if (!result) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const maxLength = 160;
  // Truncate description to fit within maxLength, accounting for ellipsis
  const description =
    result.product_desc.length > maxLength
      ? result.product_desc.substring(0, maxLength - 3) + "..."
      : result.product_desc;

  return {
    title: result.product_name,
    description: description,
    openGraph: {
      images: [
        {
          url: result.images[0],
        },
      ],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  const result = await currentProduct(slug);

  if (!result) {
    notFound();
  }

  const rating = await getAvgProductRating(slug);

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const cartItems = data?.user ? await getCartItems(data?.user?.email) : [];

  return (
    <div className="global-padding scroll-smooth space-y-12 pb-6 lg:space-y-16">
      <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_38%,rgba(245,248,255,1)_100%)] p-5 shadow-[0_22px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition-colors hover:text-slate-900">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/products"
            className="transition-colors hover:text-slate-900"
          >
            Products
          </Link>
          {result.category_slug && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={`/categories/${result.category_slug}`}
                className="transition-colors hover:text-slate-900"
              >
                {result.category_name || "Category"}
              </Link>
            </>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] lg:items-start">
          <ProductImages images={result.images} alt_texts={result.alt_texts} />

          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                  {result.category_name || "Digital Product"}
                </div>
                {rating.avg_rating > 0 && (
                  <AvgRatingContainer
                    avgRating={rating.avg_rating}
                    totalReviews={rating.total_reviews}
                  />
                )}
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-[2.9rem] lg:leading-[1.05]">
                  {result.product_name}
                </h1>
                <p className="flex items-center text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                  <IndianRupee className="mr-1 h-6 w-6" />
                  {result.price}
                </p>
              </div>

              <ShortDesc result={result} />
            </div>

            <div className="order-1 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] lg:order-2">
              <AddToCart product={result} initialCartItems={cartItems} />
            </div>

            <div className="order-2 grid gap-3 rounded-[1.5rem] border border-white/80 bg-white/85 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.05)] sm:grid-cols-3 lg:order-1">
              {[
                {
                  icon: Zap,
                  title: "Instant access",
                  description: "Digital delivery right after checkout.",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure purchase",
                  description: "Safe and encrypted transactions.",
                },
                {
                  icon: Download, // or FileCheck, RefreshCw
                  title: "Lifetime access",
                  description: "Download anytime with no expiration.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary-brand shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="order-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_16px_35px_rgba(15,23,42,0.05)]">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Sold by
              </p>
              <Link href={`/shop/${result.shop_slug}`} className="block">
                <div className="flex items-center gap-4 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100">
                  <Avatar className="h-12 w-12 border border-slate-200">
                    <AvatarImage src={result.shop_logo} />
                    <AvatarFallback className="bg-white text-slate-700">
                      {result.shop_name.at(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {result.shop_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Visit storefront and explore more products
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="desc"
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-8"
      >
        <div className="mb-6 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Product Overview
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">
            Description
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Detailed information about the product, its features, and what you
            can expect after purchase.
          </p>
        </div>

        <div className="max-w-4xl space-y-4 text-base leading-8 text-slate-700">
          {result.product_desc
            .trim()
            .split(/\n\s*\n/)
            .map((para, idx) => (
              <p key={idx}>{para.trim()}</p>
            ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="mb-6 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Reviews
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">
            Product and Seller Feedbacks
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Read what other buyers have to say about this product and their
            experience with the seller.
          </p>
        </div>

        <Reviews productId={result.product_id} sellerId={result.seller_id} />
      </section>
    </div>
  );
}
