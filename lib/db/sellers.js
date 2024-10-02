import { sql } from "@vercel/postgres";
import { getUserByEmail } from "./users";

export async function createSeller(userEmail, shopDetails) {
  try {
    const { rows } = await sql`
    UPDATE users
    SET is_seller = true
    WHERE email = ${userEmail}
    RETURNING id;
    `;

    await newShopDetails(rows[0].id, shopDetails);
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }
}

export async function newShopDetails(userId, shopDetails) {
  try {
    await sql`
      INSERT INTO sellers (user_id, shop_name, shop_description, shop_logo)
      VALUES (${userId}, ${shopDetails.name}, ${shopDetails.description}, ${shopDetails.logo})
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }
}

export async function updateShopDetails(email, shopDetails) {
  try {
    const user = await getUserByEmail(email);
    const userId = user[0].id;

    await sql`
      UPDATE sellers
      SET shop_name = ${shopDetails.name},
          shop_description = ${shopDetails.description},
          shop_slug = ${shopDetails.slug},
          shop_logo = ${shopDetails.logo}
      WHERE user_id = ${userId};
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong. Try again!");
  }
}

export async function verifySeller(email) {
  try {
    const { rows } = await sql`
      SELECT is_seller FROM users
      WHERE email = ${email};
    `;
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
}

export async function getShopDetails(email) {
  try {
    const { rows } = await sql`
      SELECT s.id, s.shop_name, s.shop_description, s.shop_slug, s.rating, s.shop_logo
      FROM sellers s JOIN users u
      ON s.user_id = u.id
      WHERE email = ${email};
    `;
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error();
  }
}

export async function getShopProducts(email) {
  const { id: sellerId } = await getShopDetails(email);

  try {
    const { rows } = await sql`
      SELECT p.*, ARRAY_AGG(i.image_url) AS images
      FROM products p
      JOIN product_images i ON p.id = i.product_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.id;
    `;
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving the products. Try again later!");
  }
}

export async function getShopBySlug(slug) {
  try {
    const { rows } = await sql`
    SELECT *
    FROM sellers
    WHERE shop_slug = ${slug}
  `;
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving the shop. Try again later!");
  }
}

export async function getShopProductsBySlug(shopSlug) {
  try {
    const { rows } = await sql`
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.description AS product_description,
        p.price,
        p.stock,
        p.slug AS product_slug,
        c.name AS category_name,
        ARRAY_AGG(i.image_url) AS images
      FROM sellers s
      JOIN products p ON s.id = p.seller_id
      JOIN product_images i ON p.id = i.product_id
      JOIN categories c ON p.category_id = c.id
      WHERE s.shop_slug = ${shopSlug}
      GROUP BY p.id, p.name, p.description, p.price, p.stock, p.slug, c.name;
    `;
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving the products. Try again later!");
  }
}
