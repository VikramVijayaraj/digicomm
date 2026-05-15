"use client";

import Link from "next/link";
import { Search, ArrowRight, Store, Sparkles, IndianRupee } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";

const trendingTopics = [
  "Art",
  "Ebooks",
  "Digital planners",
  "Templates",
  "Music",
  "Software tools",
];

const marketplaceHighlights = [
  {
    title: "Discover faster",
    description:
      "Buyers can search once and quickly find ready-to-use digital products.",
    icon: Search,
  },
  {
    title: "Open your shop",
    description:
      "Sellers can launch a storefront in minutes and start earning from expertise.",
    icon: Store,
  },
  {
    title: "Built for India",
    description:
      "UPI-friendly payments, instant delivery, and a marketplace designed for local creators and buyers.",
    icon: IndianRupee,
  },
];

export default function BannerCTA() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigateToSearch(term) {
    const normalizedTerm = term?.trim();

    if (!normalizedTerm) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("query", normalizedTerm);
    router.push(`/products?${params.toString()}`);
  }

  function handleSearch(formData) {
    navigateToSearch(formData.get("query")?.toString());
  }

  return (
    <header className="global-padding">
      <div className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(255,244,235,0.96)_36%,_rgba(255,230,214,0.92)_100%)] px-6 py-10 shadow-[0_30px_80px_rgba(181,93,28,0.12)] sm:px-8 lg:px-12 lg:py-14">
        <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-56 w-56 -translate-y-1/3 translate-x-1/4 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-40 w-40 translate-y-1/2 rounded-full bg-rose-200/40 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-orange-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              India&apos;s creator marketplace
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-7xl lg:leading-[1.05]">
              Find what you need. <br />
              <span className="font-serif italic text-primary-brand">
                Sell
              </span>{" "}
              what you know.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              Explore ebooks, templates, planners, and tools in one place, or
              open your shop and start selling to ready buyers.
            </p>

            <form
              action={handleSearch}
              className="mt-8 w-full max-w-3xl rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex min-h-16 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                  <Search className="h-5 w-5 shrink-0 text-slate-400" />
                  <input
                    type="text"
                    name="query"
                    defaultValue={searchParams.get("query")?.toString() ?? ""}
                    placeholder="Search for ebooks, templates, planners, courses, and more"
                    className="h-full w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full md:w-auto h-16 rounded-2xl bg-slate-950 px-7 text-base text-white hover:bg-slate-800 lg:mx-0"
                >
                  Search Marketplace
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <span className="flex-shrink-0 font-medium text-slate-600">
                  Trending:
                </span>
                <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 no-scrollbar">
                  {trendingTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => navigateToSearch(topic)}
                      className="whitespace-nowrap rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-slate-700 transition-colors hover:border-orange-300 hover:bg-orange-100"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button
                asChild
                className="h-[54px] text-[17px] p-[22px] rounded-full bg-gradient-to-r from-primary-brand
              to-red-400 text-white hover:from-primary-light hover:to-primary-brand
              hover:scale-105 transition-transform"
              >
                <Link href="/your/shop/register">Start Selling</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-14 rounded-full border-slate-300 bg-white/80 px-7 text-base text-slate-800 hover:bg-white"
              >
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-14">
            <div className="mb-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Why Buyers And Sellers Choose Crelands
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {marketplaceHighlights.map(
                ({ title, description, icon: Icon }) => (
                  <div
                    key={title}
                    className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-950">
                      {title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
