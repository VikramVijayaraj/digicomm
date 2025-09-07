import { supabase } from "@/supabase-client";

export async function getBlogPosts() {
  const { data, error } = await supabase
    .from("blogposts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    throw new Error("Something went wrong. Try again!");
  }

  return data;
}

export async function getBlogPostBySlug(slug) {
  const { data, error } = await supabase
    .from("blogposts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Something went wrong. Try again!");
  }

  return data;
}
