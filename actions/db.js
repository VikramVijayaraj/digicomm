import { sql } from "@vercel/postgres";

export async function getCategories() {
  const { rows } = await sql`SELECT * FROM categories`;
  return rows;
}

export async function getProducts() {
  const { rows } = await sql`
    SELECT p.id as id, p.name as product_name, p.slug, p.description as product_desc, 
           price, stock, c.name as category_name, c.description as category_desc, image_url, alt_text, i.id as image_id
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images i ON p.id = i.product_id
  `;
  return rows;
}

export async function getProduct(slug) {
  const { rows } = await sql`
    SELECT p.id as id, p.name as product_name, p.slug, p.description as product_desc,
           price, stock, c.name as category_name, c.description as category_desc, image_url, alt_text, i.id as image_id
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images i ON p.id = i.product_id
    WHERE slug = ${slug}
  `;
  return rows;
}
