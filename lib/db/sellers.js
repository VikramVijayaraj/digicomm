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
      SELECT s.id, s.shop_name, s.shop_description, s.rating, s.shop_logo
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
