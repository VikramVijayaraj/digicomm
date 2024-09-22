"use server";

import { getSearchSuggestions } from "@/lib/db/products";

export default async function SearchSuggestionsAction(searchTerm) {
  try {
    const result = await getSearchSuggestions(searchTerm);
    return result;
  } catch (error) {
    console.log(error);
  }
}
