import axios from "axios";
import { NextResponse } from "next/server";
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
    const { orderId } = await request.json();

    // Call Cashfree API
    const response = await cashfree.PGOrderFetchPayments(orderId);

    // Log and return success response
    console.log("Order fetched successfully:", response.data);
    return NextResponse.json(response.data); // Send the API response data
  } catch (error) {
    // Handle API errors safely
    console.error("Error fetching order:", error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || "Internal Server Error" },
      { status: 500 },
    );
  }

  // try {
  // const { orderId } = await request.json();

  // const response = await axios.get(
  //   `https://api.cashfree.com/pg/orders/${orderId}`,
  //   {
  //     headers: {
  //       accept: "application/json",
  //       "x-api-version": "2023-08-01",
  //       "x-client-id": process.env.CASHFREE_CLIENT_ID,
  //       "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
  //     },
  //   },
  // );

  // return NextResponse.json(response.data);
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.json(
  //     { error: "Failed to verify payment" },
  //     { status: 500 },
  //   );
  // }
}
