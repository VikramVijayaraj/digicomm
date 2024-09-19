"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { FaSearch } from "react-icons/fa";

export default function Search({ placeholder }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const searchRef = useRef("");

  function handleSearch() {
    const term = searchRef.current.value;

    if (!term) return;

    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`/products?${params.toString()}`);
  }

  // function handleSearch(term) {
  //   const params = new URLSearchParams(searchParams);

  //   if (term) {
  //     params.set("query", term);
  //   } else {
  //     params.delete("query");
  //   }
  //   replace(`${pathname}?${params.toString()}`);
  // }

  return (
    <div className="flex justify-between rounded-full px-8 py-4 items-center bg-gray-100 grow">
      <input
        className="bg-gray-100 w-full outline-none"
        placeholder={placeholder}
        // onChange={(e) => {
        //   handleSearch(e.target.value);
        // }}
        ref={searchRef}
        defaultValue={searchParams.get("query")?.toString()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <FaSearch
        id="search-icon"
        onClick={handleSearch}
        className="text-gray-500 cursor-pointer"
      />
    </div>
  );
}
