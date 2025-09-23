// import { sql } from "@vercel/postgres";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function getProducts() {
  const rows = await sql`
    SELECT DISTINCT ON (p.id) p.id AS id, 
      p.name AS product_name, 
      p.slug AS product_slug, 
      p.description AS product_desc, 
      c.slug AS category_slug,
      p.price, 
      p.stock,
      p.updated_at,
      p.seller_id,
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
  const rows = await sql`
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
      s.shop_logo,
      s.rating AS shop_rating,
      ARRAY_AGG(DISTINCT f.file_url) AS files,
      ARRAY_AGG(DISTINCT i.image_url) AS images,
      ARRAY_AGG(DISTINCT i.alt_text) AS alt_texts
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN product_images i ON p.id = i.product_id
    LEFT JOIN product_files f ON p.id = f.product_id
    JOIN sellers s ON p.seller_id = s.id
    WHERE p.slug = ${slug}
    GROUP BY p.id, c.slug, c.name, c.description, s.id;
  `;

  return rows[0];
}

export async function getProductsByCategory(slug) {
  const rows = await sql`
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
    WHERE c.slug = ${slug}
    GROUP BY p.id, c.name, c.description;
  `;

  // const { rows } = await sql.query(query, [slug]);
  return rows;
}

export async function getFilteredProducts(searchTerm) {
  const formattedSearchTerm = searchTerm?.split(" ").join(" & ");

  const rows = await sql`
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
  const rows = await sql`
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
    const rows = await sql`
      INSERT INTO products (name, description, price, category_id, seller_id, slug)
      VALUES (${productDetails.name}, ${productDetails.description}, ${productDetails.price}, ${productDetails.category}, ${productDetails.seller}, ${productDetails.slug})
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
    throw new Error("Error while adding the product image. Try again later!");
  }
}

export async function addProductFile(productId, file) {
  try {
    await sql`
      INSERT INTO product_files (product_id, file_url)
      VALUES (${productId}, ${file})
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error while adding the product file. Try again later!");
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
        price = ${productDetails.price}
      WHERE id = ${productId}
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error while updating the product. Try again later!");
  }
}

export async function deleteProduct(productId) {
  try {
    await sql`
      DELETE FROM products
      WHERE id = ${productId}
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error while deleting the product. Try again later!");
  }
}

export async function deleteProductImage(imageUrl) {
  try {
    await sql`
      DELETE FROM product_images
      WHERE image_url = ${imageUrl}
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Cannot delete image!");
  }
}

export async function deleteProductFile(fileUrl) {
  try {
    await sql`
      DELETE FROM product_files
      WHERE file_url = ${fileUrl}
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Cannot delete file!");
  }
}

// export async function updateProductStock(productId, quantity) {
//   try {
//     await sql`
//       UPDATE products
//       SET stock = stock - ${quantity}
//       WHERE id = ${productId}
//     `;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error while updating stock. Try again later!");
//   }
// }
