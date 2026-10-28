import Link from "next/link";
import { ArrowLeft, Compass, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="global-padding flex min-h-[58vh] items-center py-10 sm:py-16">
      <section className="relative w-full overflow-hidden rounded-[2rem] border border-orange-100 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] px-6 py-12 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10 sm:py-16 lg:px-16">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-red-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-orange-200 bg-white text-primary-brand shadow-[0_12px_30px_rgba(251,32,26,0.12)]">
            <SearchX className="h-8 w-8" aria-hidden="true" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
            Error 404
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            We couldn&apos;t find that page.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
            The link may be outdated, or the page may have moved. Let&apos;s get
            you back to discovering something great.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full bg-linear-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <Link href="/products">
                <Compass className="mr-2 h-4 w-4" aria-hidden="true" />
                Browse products
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
