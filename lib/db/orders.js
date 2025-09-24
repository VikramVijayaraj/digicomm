// import { updateProductStock } from "./products";
import { createPayouts, createSellerOrders } from "./sellers";
import { createClient } from "@/utils/supabase/server";

export async function createOrder(userId, orderId, totalAmount, cartItems) {
  try {
    const supabase = await createClient();

    // Insert the main order
    const { error: orderError } = await supabase.from("orders").insert([
      {
        id: orderId,
        user_id: userId,
        total_amount: totalAmount,
      },
    ]);

    if (orderError) throw orderError;

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
      const { data: seller, error: sellerError } = await supabase
        .from("products")
        .select("seller_id")
        .eq("id", item.product_id);

      if (sellerError) throw sellerError;

      const sellerId = seller[0]?.seller_id;

      if (sellerId) {
        // Insert into seller_orders
        await createSellerOrders(sellerId, orderId);

        // Add to the seller's payout (accumulate amounts if multiple products are for the same seller)
        if (!sellerPayouts[sellerId]) {
          sellerPayouts[sellerId] = 0;
        }
        sellerPayouts[sellerId] += item.price * item.quantity;
      }
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
  const supabase = await createClient();

  const { error } = await supabase.from("order_items").insert([
    {
      order_id: orderId,
      product_id: productId,
      quantity: quantity,
      price: price,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error(
      "Error while adding the order item. Please try again later!",
    );
  }

  // await updateProductStock(productId, quantity);
}

export async function getOrders(userEmail) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_orders", {
    p_user_email: userEmail,
  });

  if (error) {
    console.error(error);
    throw new Error(
      "Error while retrieving the orders. Please try again later!",
    );
  }

  return data;
}

export async function createPayment(paymentDetails) {
  const supabase = await createClient();

  const { error } = await supabase.from("payments").insert([
    {
      order_id: paymentDetails.orderId,
      user_id: paymentDetails.userId,
      amount: paymentDetails.amount,
      payment_method: paymentDetails.paymentMethod,
      status: paymentDetails.status,
      transaction_id: paymentDetails.transactionId,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error(
      "Error while storing payment details. Please try again later!",
    );
  }
}
