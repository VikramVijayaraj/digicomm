"use client";

import Link from "next/link";

export default function ShortDesc({ result }) {
  return (
    <div>
      <div className="line-clamp-3">
        {result?.product_desc
          .trim()
          .split(/\n\s*\n/) // split by empty lines (paragraphs)
          .map((para, idx, arr) => (
            // Have margin inbetween the paras expect the last one
            <p key={idx} className={idx === arr.length - 1 ? "" : "mb-4"}>
              {para.trim()}
            </p>
          ))}
      </div>
      <Link
        href="#desc"
        className="text-blue-600 hover:underline"
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
