import { sql } from "@vercel/postgres";

export async function createCartUserByEmail(email) {
  // Return the id of inserted row or the existing row
  const { rows } = await sql`
    WITH inserted AS (
      INSERT INTO carts (user_id)
      SELECT id FROM users WHERE email = ${email}
      ON CONFLICT (user_id) DO NOTHING
      RETURNING id
    )
    
    SELECT id FROM inserted
    UNION ALL
    SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE email = ${email})
    LIMIT 1;
  `;

  return rows;
}

export async function createCartItem(cartId, productId, quantity) {
  await sql`
    INSERT INTO cart_items (cart_id, product_id, quantity) 
    VALUES (${cartId}, ${productId}, ${quantity})
    ON CONFLICT (product_id) 
    DO UPDATE SET quantity = ${quantity};
  `;
}

export async function getCartItems(email) {
  const { rows } = await sql`
    SELECT i.product_id as product_id, name, quantity, price, description, stock, slug, (quantity * price) as total_price
    FROM carts c
    JOIN cart_items i ON c.id = i.cart_id
    JOIN products p ON i.product_id = p.id
    WHERE user_id = (
      SELECT id FROM users WHERE email = ${email}
    );
  `;

  return rows;
}

export async function removeProductFromCart(productId) {
  await sql`
    DELETE FROM cart_items WHERE product_id = ${productId};
  `;
}