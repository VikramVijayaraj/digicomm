import { createClient } from "@/utils/supabase/server";

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error(error.message);
    throw new Error("Something went wrong. Try again!");
  }

  return data;
}

export async function getCategoryName(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Something went wrong. Try again!");
  }

  return data;
}
