// import { sql } from "@vercel/postgres";
import { neon } from "@neondatabase/serverless";

const sql =
  process.env.SKIP_BUILD_DB_CALLS === "true"
    ? () => Promise.resolve([])
    : neon(process.env.DATABASE_URL);

export async function getCategories() {
  try {
    const rows = await sql`SELECT * FROM categories`;
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }
}

export async function getCategoryName(slug) {
  try {
    const query = `
      SELECT name FROM categories WHERE slug = $1
    `;
    const rows = await sql.query(query, [slug]);
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }
}
