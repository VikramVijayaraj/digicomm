import { sql } from "@vercel/postgres";

export async function fetchProducts(condition, params) {
  let query = `
    SELECT p.id as id, p.name as product_name, p.slug as product_slug, p.description as product_desc, c.slug as category_slug,
           price, stock, c.name as category_name, c.description as category_desc, image_url, alt_text, i.id as image_id
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images i ON p.id = i.product_id
  `;

  if (condition != null) {
    query += ` ${condition}`;
  }

  const { rows } = await sql.query(query, params);
  return rows;
}

export async function getProducts() {
  const rows = await fetchProducts();
  return rows;
}

export async function getProduct(slug) {
  const row = await fetchProducts(`WHERE p.slug = $1`, [slug]);
  return row;
}

export async function getProductsByCategory(slug) {
  const query = `
    SELECT 
      p.id as id, 
      p.name as product_name, 
      p.slug, 
      p.description as product_desc, 
      p.price, 
      p.stock, 
      c.name as category_name, 
      c.description as category_desc, 
      ARRAY_AGG(i.image_url) AS images,
      ARRAY_AGG(i.alt_text) AS alt_texts
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images i ON p.id = i.product_id
    WHERE c.slug = $1
    GROUP BY p.id, c.name, c.description;
  `;

  const { rows } = await sql.query(query, [slug]);
  return rows;
}
