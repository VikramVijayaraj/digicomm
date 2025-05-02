import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function getBlogPosts() {
  try {
    const rows = await sql`
      SELECT * FROM blogposts
      WHERE published_status = true
      ORDER BY created_at DESC
    `;
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }
}

export async function getBlogPostBySlug(slug) {
  try {
    const rows = await sql`
      SELECT * FROM blogposts WHERE slug = ${slug}
    `;
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }
}
