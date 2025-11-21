import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { Cashfree, CFEnvironment } from "cashfree-pg";

// Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
// Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
// Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET,
);

export async function POST(request) {
  try {
    const { orderAmount, customerDetails } = await request.json();
    const orderId = uuid();

    // Strictly required by Cashfree API
    // If phone is missing, use a dummy 10-digit number.
    // If email is missing, use a dummy email (optional, but good for safety).
    const phone = customerDetails.customer_phone || "9999999999";
    const email = customerDetails.customer_email || "guest@example.com";

    const cashfreeRequest = {
      order_amount: orderAmount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: customerDetails.customer_id,
        customer_phone: phone,
        customer_email: email,
      },
    };

    const response = await cashfree.PGCreateOrder(cashfreeRequest);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
