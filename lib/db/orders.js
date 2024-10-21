import { sql } from "@vercel/postgres";

import { updateProductStock } from "./products";
import { createPayouts, createSellerOrders } from "./sellers";

export async function createOrder(userId, orderId, totalAmount, cartItems) {
  try {
    await sql`
      INSERT INTO orders (id, user_id, total_amount)
      VALUES (${orderId}, ${userId}, ${totalAmount})
    `;

    // Track payouts for each seller
    const sellerPayouts = {};

    for (const item of cartItems) {
      await createOrderItem(
        orderId,
        item.product_id,
        item.quantity,
        item.price,
      );

      // Get the seller_id associated with the product
      const { rows: seller } = await sql`
        SELECT seller_id FROM products WHERE id = ${item.product_id}
      `;

      const sellerId = seller[0]?.seller_id;

      // Insert into seller_orders
      await createSellerOrders(sellerId, orderId);

      // Add to the seller's payout (accumulate amounts if multiple products are for the same seller)
      if (!sellerPayouts[sellerId]) {
        sellerPayouts[sellerId] = 0;
      }
      sellerPayouts[sellerId] += item.price * item.quantity;
    }

    // Insert payouts for each seller
    for (const sellerId in sellerPayouts) {
      await createPayouts(sellerId, sellerPayouts[sellerId]);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error while creating the order. Please try again later!");
  }
}

export async function createOrderItem(orderId, productId, quantity, price) {
  try {
    await sql`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (${orderId}, ${productId}, ${quantity}, ${price})
    `;

    await updateProductStock(productId, quantity);
  } catch (error) {
    console.error(error);
    throw new Error(
      "Error while adding the order item. Please try again later!",
    );
  }
}

export async function getOrders(userEmail) {
  try {
    const { rows } = await sql`
      SELECT 
          i.id AS order_item_id,
          i.quantity,
          i.price,
          i.created_at AS order_placed_at,
          p.id AS product_id,
          p.name AS product_name,
          p.slug AS product_slug,
          ARRAY_AGG(DISTINCT pf.file_url) AS files,
          c.name AS category_name,
          c.slug AS category_slug
      FROM orders o
      JOIN order_items i ON o.id = i.order_id
      JOIN users u ON o.user_id = u.id
      JOIN products p ON p.id = i.product_id
      JOIN product_files pf ON p.id = pf.product_id
      JOIN categories c ON p.category_id = c.id
      WHERE u.email = ${userEmail}
      GROUP BY i.id, p.id, p.slug, c.name, c.slug
      ORDER BY i.created_at DESC;
    `;
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Error while retrieving the orders. Please try again later!",
    );
  }
}

export async function createPayment(paymentDetails) {
  try {
    await sql`
      INSERT INTO payments (order_id, user_id, amount, payment_method, status, transaction_id)
      VALUES (${paymentDetails.orderId}, ${paymentDetails.userId}, ${paymentDetails.amount}, ${paymentDetails.paymentMethod}, ${paymentDetails.status}, ${paymentDetails.transactionId})
    `;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Error while storing payment details. Please try again later!",
    );
  }
}
