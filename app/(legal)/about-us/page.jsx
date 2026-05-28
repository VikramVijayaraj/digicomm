import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  UsersRound,
} from "lucide-react";

export const metadata = {
  title: "About Us",
};

const valueCards = [
  {
    icon: Search,
    title: "Discover useful digital products",
    description:
      "Buyers can search across ebooks, templates, courses, and creative assets from Indian creators.",
  },
  {
    icon: Store,
    title: "Sell without heavy setup",
    description:
      "Creators can open a shop, list digital products, and share a storefront built for quick purchases.",
  },
  {
    icon: ShieldCheck,
    title: "Simple, secure transactions",
    description:
      "Payments, delivery, and buyer access are designed to keep each purchase smooth and dependable.",
  },
];

const reasons = [
  "A focused marketplace for digital goods instead of generic listings.",
  "Buyer-friendly product pages that make it easier to compare and purchase.",
  "Creator tools for storefronts, uploads, payments, and product management.",
  "A community-first approach for people who create and use digital products.",
];

const steps = [
  "Create an account in minutes.",
  "Set up a shop or start browsing products.",
  "Upload digital products or purchase ready-to-use files.",
  "Deliver products instantly and manage everything from one place.",
];

export default function AboutPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Crelands";
  const appTagline =
    process.env.NEXT_PUBLIC_APP_TAGLINE ||
    "India's creator marketplace for digital products";

  return (
    <div className="global-padding space-y-6 pb-10">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              About {appName}
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
              A cleaner marketplace for people who create and buy digital
              products.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {appName} brings ebooks, templates, courses, digital art, and
              practical creator resources into one place. {appTagline}.
            </p>
            {/* <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white transition hover:from-primary-light hover:to-primary-brand"
              >
                Explore products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Contact us
              </Link>
            </div> */}
          </div>

          <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
              <Compass className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Our focus
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Useful products, trusted creators, fast access.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The platform is built around digital discovery and digital
              selling, so buyers find practical resources and creators get a
              direct way to earn.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {valueCards.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)]"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="mb-6 border-b border-slate-200 pb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Who we are
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Built for both sides of the marketplace.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-7 text-slate-600">
            <p>
              At {appName}, we believe creators should have a simple way to
              share, sell, and showcase digital products. Artists, designers,
              developers, educators, and makers can bring their work online
              without a complicated setup.
            </p>
            <p>
              We also believe buyers should have a better way to discover useful
              digital resources. Whether someone needs a template, ebook,
              course, planner, design asset, or creative file, the experience
              should be clear from search to download.
            </p>
            <p>
              Our mission is to create an inclusive marketplace that celebrates
              digital craftsmanship while keeping the buying and selling process
              practical, transparent, and easy to manage.
            </p>
          </div>
        </div>

        <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:sticky lg:top-24">
          <div className="mb-5 flex items-center gap-3">
            <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
              <UsersRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Why choose us
              </p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                Marketplace essentials
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {reasons.map((reason) => (
              <div key={reason} className="flex gap-3 text-sm leading-6">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-brand" />
                <p className="text-slate-600">{reason}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Start as a buyer, seller, or both.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {appName} keeps the flow direct so users can move from discovery
              to purchase, or from upload to storefront, without unnecessary
              friction.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-primary-brand shadow-sm">
                  {index + 1}
                </span>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-700">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">
              Join the community
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              Create, discover, and grow with {appName}.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Whether you want to sell your latest digital product or find
              ready-to-use resources from creators, {appName} is built for that
              journey.
            </p>
          </div>
          <Link
            href="/contact-us"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-orange-50"
          >
            Reach out
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
