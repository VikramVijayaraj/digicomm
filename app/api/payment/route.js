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

    const cashfreeRequest = {
      order_amount: orderAmount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: customerDetails,
    };

    const response = await cashfree.PGCreateOrder(
      "2023-08-01",
      cashfreeRequest,
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
