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
    SELECT 
      p.id AS product_id,
      p.name AS product_name,
      p.slug AS product_slug,
      p.description AS product_desc,
      c.slug AS category_slug,
      p.price,
      p.stock,
      c.name AS category_name,
      c.description AS category_desc,
      s.id AS seller_id,
      s.shop_name,
      s.shop_slug,
      s.rating AS shop_rating,
      ARRAY_AGG(DISTINCT i.image_url) AS images,
      ARRAY_AGG(DISTINCT i.alt_text) AS alt_texts
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN product_images i ON p.id = i.product_id
    JOIN sellers s ON p.seller_id = s.id
    WHERE p.slug = ${slug}
    GROUP BY p.id, c.slug, c.name, c.description, s.id;
  `;

  return rows[0];
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

export async function getSearchSuggestions(searchTerm) {
  const { rows } = await sql`
    SELECT 
      p.id,
      p.name AS product_name,
      p.slug AS product_slug,
      c.name AS category_name,
      c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE
        p.search_vector @@ plainto_tsquery('english', ${searchTerm}) OR
        c.search_vector @@ plainto_tsquery('english', ${searchTerm})
    LIMIT 5;
  `;

  return rows;
}

export async function addProduct(productDetails) {
  try {
    const { rows } = await sql`
      INSERT INTO products (name, description, price, stock, category_id, seller_id, slug)
      VALUES (${productDetails.name}, ${productDetails.description}, ${productDetails.price}, ${productDetails.stock}, ${productDetails.category}, ${productDetails.seller}, ${productDetails.slug})
      RETURNING id
    `;
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error while adding the product. Try again later!");
  }
}

export async function addProductImage(productId, image) {
  try {
    await sql`
      INSERT INTO product_images (product_id, image_url)
      VALUES (${productId}, ${image})
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error while adding the product. Try again later!");
  }
}

export async function updateProduct(productId, productDetails) {
  try {
    await sql`
      UPDATE products
      SET 
        name = ${productDetails.name},
        description = ${productDetails.description},
        category_id = ${productDetails.category},
        slug = ${productDetails.slug},
        stock = ${productDetails.stock},
        price = ${productDetails.price}
      WHERE id = ${productId}
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error while updating the product. Try again later!");
  }
}

export async function deleteProductImage(image) {
  try {
    await sql`
      DELETE FROM product_images
      WHERE image_url = ${image}
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Cannot delete image!");
  }
}
