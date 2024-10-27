"use client";

import Link from "next/link";

export default function ShortDesc({ result }) {
  return (
    <div>
      <p className="line-clamp-3">{result?.product_desc}</p>
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
