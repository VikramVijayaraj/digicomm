"use client";

import Link from "next/link";

export default function ShortDesc({ result }) {
  return (
    <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <div className="line-clamp-3 text-base leading-7 text-slate-700">
        {result?.product_desc
          .trim()
          .split(/\n\s*\n/)
          .map((para, idx, arr) => (
            <p key={idx} className={idx === arr.length - 1 ? "" : "mb-4"}>
              {para.trim()}
            </p>
          ))}
      </div>
      <Link
        href="#desc"
        className="mt-3 inline-flex text-sm font-semibold text-primary-brand transition-colors hover:text-primary-light"
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById("desc")
            .scrollIntoView({ behavior: "smooth" });
        }}
      >
        See full description
      </Link>
    </div>
  );
}
