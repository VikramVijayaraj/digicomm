import { sql } from "@vercel/postgres";

export async function getProducts() {
  const { rows } = await sql`
    SELECT DISTINCT ON (p.id) p.id AS id, 
      p.name AS product_name, 
      p.slug AS product_slug, 
      p.description AS product_desc, 
      c.slug AS category_slug,
      p.price, 
      p.stock, 
      c.name AS category_name, 
      c.description AS category_desc, 
      i.image_url, 
      i.alt_text
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN product_images i ON p.id = i.product_id
  `;
  return rows;
}

export async function getProduct(slug) {
  const { rows } = await sql`
    SELECT i.id AS id, 
      p.name AS product_name, 
      p.slug AS product_slug, 
      p.description AS product_desc, 
      c.slug AS category_slug,
      p.price, 
      p.stock, 
      c.name AS category_name, 
      c.description AS category_desc, 
      i.image_url, 
      i.alt_text
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN product_images i ON p.id = i.product_id
    WHERE p.slug = ${slug}
  `;
  return rows;
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

export async function getFilteredProducts(searchTerm) {
  const formattedSearchTerm = searchTerm?.split(" ").join(" & ");

  const { rows } = await sql`
    SELECT * FROM (
      SELECT DISTINCT ON (p.id) 
        p.id AS id, 
        p.name AS product_name, 
        p.slug AS product_slug, 
        p.description AS product_desc, 
        c.slug AS category_slug,
        p.price, 
        p.stock, 
        c.name AS category_name, 
        c.description AS category_desc, 
        i.image_url, 
        i.alt_text,
        ts_rank(p.search_vector || c.search_vector, to_tsquery('english', ${formattedSearchTerm})) AS rank
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN product_images i ON p.id = i.product_id
      WHERE 
        (p.search_vector || c.search_vector) @@ to_tsquery('english', ${formattedSearchTerm})
      ORDER BY p.id, rank DESC
    ) AS ranked_products
    ORDER BY rank DESC;
  `;

  return rows;
}
