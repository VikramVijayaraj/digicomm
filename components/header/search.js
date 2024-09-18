"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export default function Search({ placeholder }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term) {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex justify-between rounded-full px-8 py-4 items-center bg-gray-100 grow">
      <input
        className="bg-gray-100 w-full outline-none"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <FaSearch className="text-gray-500 cursor-pointer" />
    </div>
  );
}
