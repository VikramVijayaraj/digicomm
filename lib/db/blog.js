import { supabase } from "@/supabase-client";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

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

export async function getActiveBlogPosts() {
  try {
    const rows = await sql`
      SELECT * FROM blogposts WHERE published_status = true
      ORDER BY created_at DESC
    `;
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }
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
