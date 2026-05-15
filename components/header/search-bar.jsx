"use client";

import { useRef, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { SearchSuggestionsAction } from "@/actions/product-actions";

export default function SearchBar({ placeholder }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const searchRef = useRef("");
  const suggestionsRef = useRef(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  async function handleSuggestions(e) {
    setIsSearching(true);
    const { value: term } = e.target;

    if (!term) {
      setIsSearching(false);
      return;
    }

    try {
      const suggestions = await SearchSuggestionsAction(term);
      setSearchSuggestions(suggestions);
    } catch (error) {
      console.log(error);
    }
  }

  function handleSearch() {
    const term = searchRef.current.value.trim();

    if (!term) {
      setIsSearching(false);
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("query", term);
    replace(`/products?${params.toString()}`);
    setIsSearching(false); // Close suggestions after search
  }

  // Close suggestion container on outside click or ESC key press
  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        searchRef?.current &&
        !searchRef?.current?.contains(e.target) &&
        !suggestionsRef?.current?.contains(e.target)
      ) {
        setIsSearching(false);
      }
    }

    function handleEscPress(e) {
      if (e.key === "Escape") {
        setIsSearching(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscPress);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscPress);
    };
  }, []);

  return (
    <div className="grow relative w-full">
      <div
        className={`flex items-center justify-between gap-3 border border-slate-200 bg-white px-5 py-3 shadow-sm ${
          isSearching ? "rounded-t-[1.5rem]" : "rounded-full"
        }`}
      >
        <input
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          placeholder={placeholder}
          onChange={handleSuggestions}
          ref={searchRef}
          defaultValue={searchParams.get("query")?.toString()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Search
          id="search-icon"
          onClick={handleSearch}
          className="h-4 w-4 cursor-pointer text-slate-500"
        />
      </div>

      {isSearching && (
        <div
          className="absolute z-10 w-full rounded-b-[1.5rem] border border-t-0 border-slate-200 bg-white py-2 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          ref={suggestionsRef}
        >
          {searchSuggestions.map((suggestion) => (
            <Link
              href={"/products/" + suggestion.product_slug}
              className="cursor-pointer"
              key={suggestion.id}
            >
              <div className="mx-2 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50">
                <p className="text-sm font-medium text-slate-900">
                  {suggestion.product_name.toLowerCase()}
                </p>
                <p className="text-sm text-slate-500">
                  {suggestion.category_name.toLowerCase()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
