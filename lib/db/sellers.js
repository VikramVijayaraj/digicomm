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
      INSERT INTO sellers (user_id, shop_name, shop_description, shop_logo, shop_banner, shop_slug)
      VALUES (${userId}, ${shopDetails.name}, ${shopDetails.description}, ${shopDetails.logo}, ${shopDetails.banner}, ${shopDetails.slug})
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
          shop_logo = ${shopDetails.logo},
          shop_banner = ${shopDetails.banner}
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
      SELECT s.id, s.shop_name, s.shop_description, s.shop_slug, s.rating, s.shop_logo, s.shop_banner
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
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.description AS product_description,
        p.slug AS product_slug,
        p.stock,
	      p.price,
        p.updated_at,
        c.name AS category_name,
        ARRAY_AGG(DISTINCT f.file_url) AS files,
        ARRAY_AGG(i.image_url) AS images
      FROM products p
      JOIN product_images i ON p.id = i.product_id
      JOIN product_files f ON p.id = f.product_id
      JOIN categories c ON p.category_id = c.id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.id, c.name;
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

export async function createSellerOrders(sellerId, orderId) {
  try {
    await sql`
      INSERT INTO seller_orders (seller_id, order_id)
      VALUES (${sellerId}, ${orderId})
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating the seller order. Try again later!");
  }
}

export async function createPayouts(sellerId, amount) {
  try {
    await sql`
      INSERT INTO payouts (seller_id, amount)
      VALUES (${sellerId}, ${amount})
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating the payout. Try again later!");
  }
}

export async function getSellerOrders(userEmail) {
  try {
    const { rows } = await sql`
      SELECT DISTINCT
        o.id AS order_id,
        o.total_amount,
        o.created_at AS order_date,
        p.name AS product_name,
        oi.quantity,
        oi.price
      FROM 
        seller_orders so
      JOIN 
        orders o ON so.order_id = o.id
      JOIN 
        order_items oi ON oi.order_id = o.id
      JOIN 
        products p ON oi.product_id = p.id
      JOIN 
        sellers s ON s.id = so.seller_id
      JOIN 
        users u ON s.user_id = u.id
      WHERE 
        u.email = ${userEmail}
      ORDER BY 
        o.created_at DESC;
    `;
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving the seller orders. Try again later!");
  }
}

export async function createSellerBankDetails(bankDetails) {
  try {
    await sql`
      INSERT INTO seller_bank_details 
        (seller_id, account_holder_name, account_number, ifsc_code, phone, verification_status)
      VALUES 
        (${bankDetails.sellerId}, ${bankDetails.accountHolderName}, ${bankDetails.accountNumber}, ${bankDetails.ifscCode}, ${bankDetails.phone}, ${bankDetails.verificationStatus})
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating the seller bank details. Try again later!");
  }
}

export async function updateSellerBankDetails(bankDetails) {
  try {
    await sql`
      UPDATE seller_bank_details
      SET account_holder_name = ${bankDetails.accountHolderName},
          account_number = ${bankDetails.accountNumber},
          ifsc_code = ${bankDetails.ifscCode},
          phone = ${bankDetails.phone},
          verification_status = ${bankDetails.verificationStatus}
      WHERE seller_id = ${bankDetails.sellerId}
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating the seller bank details. Try again later!");
  }
}

export async function getSellerBankDetails(email) {
  try {
    const { rows } = await sql`
      SELECT sbd.*
      FROM seller_bank_details sbd
      JOIN sellers s ON sbd.seller_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE u.email = ${email}
    `;
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error(
      "Error retrieving the seller bank details. Try again later!",
    );
  }
}
