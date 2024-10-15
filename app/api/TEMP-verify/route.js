import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-verification";

export async function GET() {
  try {
    // const { orderId } = await request.json();
    // const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    // return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
