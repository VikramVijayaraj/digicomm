import { sql } from "@vercel/postgres";

export async function getCategories() {
  const { rows } = await sql`SELECT * FROM categories`;
  return rows;
}

export async function getCategoryName(slug) {
  const query = `
    SELECT name FROM categories WHERE slug = $1
  `;
  const { rows } = await sql.query(query, [slug]);
  return rows[0];
}
