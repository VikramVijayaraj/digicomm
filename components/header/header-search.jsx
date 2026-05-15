"use client";

import { usePathname } from "next/navigation";

import SearchBar from "./search-bar";

export default function HeaderSearch({ placeholder, className = "" }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <div className={className}>
      <SearchBar placeholder={placeholder} />
    </div>
  );
}
