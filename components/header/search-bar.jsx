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
    const term = searchRef.current.value;

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
    <div className="w-full relative">
      <div
        className={`flex justify-between px-8 py-4 items-center bg-gray-100 grow ${
          isSearching ? "rounded-t-3xl" : "rounded-full" }`}
      >
        <input
          className="bg-gray-100 w-full outline-none"
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
          className="text-gray-500 cursor-pointer"
        />
        {/* <FaSearch
          id="search-icon"
          onClick={handleSearch}
          className="text-gray-500 cursor-pointer"
        /> */}
      </div>

      {isSearching && (
        <div
          className="absolute py-2 bg-gray-100 z-10 rounded-b-3xl w-full"
          ref={suggestionsRef}
        >
          {searchSuggestions.map((suggestion) => (
            <Link
              href={"/products/" + suggestion.product_slug}
              className="cursor-pointer"
              key={suggestion.id}
            >
              <div className="px-4 w-full py-4 hover:bg-gray-300 rounded-xl">
                <p>{suggestion.product_name.toLowerCase()}</p>
                <p className="text-gray-500">
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
