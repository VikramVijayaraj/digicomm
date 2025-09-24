import { createClient } from "@/utils/supabase/server";

export async function getBlogPosts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogposts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }

  return data;
}

export async function getBlogPostBySlug(slug) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogposts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }

  return data;
}
