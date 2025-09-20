import { createClient } from "@/utils/supabase/server";

export async function createCartUserByEmail(email) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_cart_user_by_email", {
    user_email: email,
  });

  if (error) {
    console.error(error.message);
    throw new Error("Cannot fetch products!");
  }

  return data;
}

export async function createCartItem(cartId, productId, quantity) {
  const supabase = await createClient();

  const { error } = await supabase.from("cart_items").upsert(
    {
      cart_id: cartId,
      product_id: productId,
      quantity: quantity,
    },
    {
      // This option specifies which columns to check for a conflict.
      // It's the equivalent of "ON CONFLICT (cart_id, product_id)".
      onConflict: "cart_id,product_id",
    },
  );

  if (error) {
    console.error(error);
    throw new Error("Cannot add item to cart!");
  }
}

export async function getCartItems(email) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_cart_items", {
    p_email: email,
  });

  if (error) {
    console.error(error.message);
    throw new Error("Cannot fetch cart items!");
  }

  return data;
}

export async function removeProductFromCart(cartId, productId) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId)
    .eq("product_id", productId);

  if (error) {
    console.error(error);
    throw new Error("Cannot remove item from cart!");
  }
}


