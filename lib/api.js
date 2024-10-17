import axios from "axios";

export async function fetchPaymentDetails(orderId) {
  try {
    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`,
      {
        headers: {
          accept: "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw new Error("Failed to fetch payment details");
  }
}
