"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";

const trendingTopics = [
  "Art",
  "Ebooks",
  "Collectibles",
  "Templates",
  "Music",
  "Software",
];

/* ---------- Illustrations ---------- */
/* Hand-drawn-feel line art, single-weight strokes, brand-colored fills.
   Buy side: three "outcome" objects (planner, ebook, font/art card) loosely
   composed — selling the result of a purchase, not generic icons.
   Sell side: a single payout visual — a full bar / "100% kept" device that
   makes the zero-commission point visible rather than stated. */

function BuyIllustration() {
  return (
    <svg
      viewBox="0 0 360 280"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      {/* soft ground shadow */}
      <ellipse
        cx="180"
        cy="248"
        rx="130"
        ry="14"
        fill="#E8321A"
        opacity="0.06"
      />

      {/* digital planner / notebook, tilted */}
      <g transform="translate(36,58) rotate(-7)">
        <rect
          x="0"
          y="0"
          width="124"
          height="158"
          rx="10"
          fill="#FFFDF9"
          stroke="#1A1410"
          strokeWidth="2.5"
        />
        <rect
          x="0"
          y="0"
          width="124"
          height="34"
          rx="10"
          fill="#FFB347"
          stroke="#1A1410"
          strokeWidth="2.5"
        />
        <line
          x1="16"
          y1="58"
          x2="108"
          y2="58"
          stroke="#1A1410"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <line
          x1="16"
          y1="76"
          x2="92"
          y2="76"
          stroke="#1A1410"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
        <line
          x1="16"
          y1="94"
          x2="100"
          y2="94"
          stroke="#1A1410"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
        <rect
          x="16"
          y="112"
          width="22"
          height="22"
          rx="5"
          stroke="#E8321A"
          strokeWidth="2.5"
        />
        <path
          d="M21 123l4 4 8-9"
          stroke="#E8321A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="46"
          y1="123"
          x2="100"
          y2="123"
          stroke="#1A1410"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>

      {/* ebook cover, overlapping */}
      <g transform="translate(150,30) rotate(6)">
        <rect
          x="0"
          y="0"
          width="108"
          height="148"
          rx="8"
          fill="#FFE3C2"
          stroke="#1A1410"
          strokeWidth="2.5"
        />
        <rect
          x="10"
          y="10"
          width="88"
          height="60"
          rx="4"
          fill="#1A1410"
          opacity="0.85"
        />
        <path
          d="M22 52l14-18 12 12 10-14 18 20"
          stroke="#FFB347"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="10"
          y1="84"
          x2="86"
          y2="84"
          stroke="#1A1410"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <line
          x1="10"
          y1="98"
          x2="70"
          y2="98"
          stroke="#1A1410"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
        <line
          x1="10"
          y1="112"
          x2="92"
          y2="112"
          stroke="#1A1410"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>

      {/* type / font sample card, lower right */}
      <g transform="translate(190,148) rotate(-3)">
        <rect
          x="0"
          y="0"
          width="118"
          height="86"
          rx="10"
          fill="#FFFDF9"
          stroke="#1A1410"
          strokeWidth="2.5"
        />
        <text
          x="14"
          y="42"
          fontFamily="Georgia, serif"
          fontSize="34"
          fill="#E8321A"
          fontStyle="italic"
        >
          Aa
        </text>
        <line
          x1="14"
          y1="62"
          x2="100"
          y2="62"
          stroke="#1A1410"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.35"
        />
        <line
          x1="14"
          y1="72"
          x2="76"
          y2="72"
          stroke="#1A1410"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.25"
        />
      </g>

      {/* small floating sparkle marks for "ready to use" feel */}
      <path
        d="M312 96l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"
        fill="#E8321A"
        opacity="0.85"
      />
      <circle cx="44" cy="40" r="4" fill="#FFB347" />
      <circle cx="330" cy="190" r="5" fill="#E8321A" opacity="0.5" />
    </svg>
  );
}

function SellIllustration() {
  return (
    <svg
      viewBox="0 0 360 280"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        cx="180"
        cy="248"
        rx="140"
        ry="14"
        fill="#F5D9A8"
        opacity="0.08"
      />

      {/* storefront card, tilted left, anchor piece */}
      <g transform="translate(34,66) rotate(-6)">
        <rect
          x="0"
          y="0"
          width="128"
          height="148"
          rx="10"
          fill="none"
          stroke="#F5D9A8"
          strokeWidth="2.5"
        />
        <path
          d="M0 28 L64 0 L128 28"
          stroke="#F5D9A8"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <rect
          x="14"
          y="42"
          width="34"
          height="34"
          rx="6"
          stroke="#F5D9A8"
          strokeWidth="2.5"
        />
        <path
          d="M20 58l6-8 5 6 7-8"
          stroke="#F5D9A8"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="58"
          y="44"
          width="56"
          height="7"
          rx="3"
          fill="#F5D9A8"
          opacity="0.55"
        />
        <rect
          x="58"
          y="56"
          width="40"
          height="7"
          rx="3"
          fill="#F5D9A8"
          opacity="0.35"
        />
        <rect
          x="14"
          y="92"
          width="100"
          height="7"
          rx="3"
          fill="#F5D9A8"
          opacity="0.4"
        />
        <rect
          x="14"
          y="106"
          width="76"
          height="7"
          rx="3"
          fill="#F5D9A8"
          opacity="0.25"
        />
      </g>

      {/* "sold" product card, overlapping right */}
      <g transform="translate(168,44) rotate(5)">
        <rect
          x="0"
          y="0"
          width="104"
          height="104"
          rx="10"
          fill="#1A1410"
          stroke="#F5D9A8"
          strokeWidth="2.5"
        />
        <path
          d="M16 60l16-22 14 14 12-16 22 24"
          stroke="#F5D9A8"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="86" cy="20" r="13" fill="#F5D9A8" />
        <path
          d="M80 20l4 4 8-8"
          stroke="#1A1410"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* rupee coin stack */}
      <g transform="translate(252,112)">
        <ellipse
          cx="30"
          cy="36"
          rx="30"
          ry="11"
          fill="none"
          stroke="#F5D9A8"
          strokeWidth="2.5"
        />
        <ellipse
          cx="30"
          cy="24"
          rx="30"
          ry="11"
          fill="none"
          stroke="#F5D9A8"
          strokeWidth="2.5"
        />
        <ellipse cx="30" cy="12" rx="30" ry="11" fill="#F5D9A8" />
        <text
          x="30"
          y="17"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="15"
          fill="#1A1410"
        >
          ₹
        </text>
      </g>

      {/* payout bar — the signature piece for this side */}
      <g transform="translate(44,192)">
        <rect
          x="0"
          y="0"
          width="272"
          height="36"
          rx="18"
          fill="none"
          stroke="#F5D9A8"
          strokeWidth="2.5"
        />
        <rect x="3" y="3" width="266" height="30" rx="15" fill="#F5D9A8" />
        <text
          x="136"
          y="23"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="14"
          fontWeight="700"
          fill="#1A1410"
          letterSpacing="0.5"
        >
          YOU KEEP 100%
        </text>
      </g>
      <text
        x="180"
        y="246"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="11"
        fill="#F5D9A8"
        opacity="0.7"
        letterSpacing="1.5"
      >
        ₹0 PLATFORM COMMISSION
      </text>

      <path
        d="M40 174l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"
        fill="#F5D9A8"
        opacity="0.6"
      />
      <circle cx="320" cy="76" r="4" fill="#F5D9A8" opacity="0.5" />
    </svg>
  );
}

export default function BannerCTA() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigateToSearch(term) {
    const normalizedTerm = term?.trim();
    if (!normalizedTerm) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", normalizedTerm);
    router.push(`/products?${params.toString()}`);
  }

  function handleSearch(formData) {
    navigateToSearch(formData.get("query")?.toString());
  }

  return (
    <header className="global-padding">
      {/* <div className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-orange-700">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5">
          India&apos;s creator marketplace
        </span>
      </div> */}

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
        <div className="grid lg:grid-cols-2">
          {/* ---------------- BUY SIDE ---------------- */}
          <div className="relative flex flex-col bg-[#FFF8F0] px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
                Looking for something?
              </p>
              <h2 className="mt-3 text-4xl font-bold leading-[1.05] text-slate-950 sm:text-5xl">
                Find{" "}
                <span className="font-serif italic text-primary-brand">
                  ready-to-use{" "}
                </span>
                <br />
                digital products
                {/* <span className="font-serif italic text-primary-brand">
                  today
                </span> */}
                .
              </h2>

              <div className="my-7 h-40 sm:h-48">
                <BuyIllustration />
              </div>
            </div>
            <form action={handleSearch} className="mt-auto w-full">
              <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-3 shadow-sm">
                <Search className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  name="query"
                  defaultValue={searchParams.get("query")?.toString() ?? ""}
                  placeholder="Ebooks, templates, planners, fonts…"
                  className="h-full w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => navigateToSearch(topic)}
                    className="rounded-full border border-orange-200 bg-white px-3 py-1 text-xs text-slate-600 transition-colors hover:border-orange-300 hover:bg-orange-50"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                className="mt-6 h-14 w-full rounded-full bg-slate-950 text-base text-white hover:bg-slate-800 cursor-pointer"
              >
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* ---------------- SEAM ---------------- */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 lg:flex lg:items-center lg:justify-center">
            <svg
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
              className="absolute h-full w-px"
            >
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="100"
                stroke="#1A1410"
                strokeWidth="2"
                strokeDasharray="1,7"
                opacity="0.35"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-bold tracking-wide text-slate-400 shadow-[0_4px_14px_rgba(15,23,42,0.12)]">
              OR
            </span> */}
          </div>

          {/* ---------------- SELL SIDE ---------------- */}
          <div className="relative flex flex-col bg-[#1A1410] px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F5D9A8]">
                Made something?
              </p>
              <h2 className="mt-3 text-4xl font-bold leading-[1.05] text-[#FFFDF9] sm:text-5xl">
                Sell what you{" "}
                <span className="font-serif italic text-[#F5D9A8]">know</span>.
                <br />
                Keep every rupee.
              </h2>

              <div className="my-7 h-40 sm:h-48">
                <SellIllustration />
              </div>

              <p className="text-sm leading-6 text-[#FFFDF9]/70">
                No commission, no listing fees. UPI payouts, instant delivery,
                and a storefront live in minutes.
              </p>
            </div>
            <Button
              asChild
              className="mt-auto h-14 w-full rounded-full bg-gradient-to-r from-primary-brand to-red-400 text-base text-white hover:scale-[1.02] hover:from-primary-light hover:to-primary-brand transition-transform"
            >
              <Link href="/your/shop/register">
                Start Selling — It&apos;s Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
