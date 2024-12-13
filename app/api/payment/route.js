import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";
import { v4 as uuid } from "uuid";

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

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

    const response = await Cashfree.PGCreateOrder(
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
