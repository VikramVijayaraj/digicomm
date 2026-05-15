"use client";

import { usePathname } from "next/navigation";

import SearchBar from "./search-bar";

export default function MobileSearchRow({ placeholder }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <div className="global-padding mt-4 lg:hidden">
      <SearchBar placeholder={placeholder} />
    </div>
  );
}
