import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { notifyOnSlack } from "@/lib/api";
import { getOrders } from "@/lib/db/orders";

export default async function OrderConfirmation({ searchParams }) {
  const { orderId, email } = searchParams;

  if (!orderId || !email) redirect("/");

  const orders = await getOrders(email);

  if (!orders || orders.length === 0) redirect("/");

  const totalAmount = orders.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Notify to admin
  // await notifyOnSlack(
  //   `New order placed by guest user (${email}) - Order ID: ${orderId}, Amount: ₹${totalAmount}`,
  // );

  return (
    <div className="max-w-lg mx-auto px-4 lg:px-0 my-10 md:my-20 text-center space-y-6">
      {/* Success icon */}
      <div className="text-green-500 text-6xl">✓</div>

      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p className="text-gray-500">
        Your download link have been sent to <strong>{email}</strong>
      </p>

      {/* Order summary */}
      <div className="text-left border rounded-lg p-4 space-y-3">
        <p className="text-sm text-gray-500">Order #{orderId}</p>

        {orders.map((item) => (
          <div
            key={item.order_item_id}
            className="flex justify-between text-sm"
          >
            <span>
              {item.product_name}
              {item.quantity > 1 && (
                <span className="text-gray-400 ml-1">x{item.quantity}</span>
              )}
            </span>
            <span>₹{item.price}</span>
          </div>
        ))}

        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      {/* Email reminder */}
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
        📧 Check your inbox at <strong>{email}</strong> for your download links.
        <br />
        <span className="text-xs text-blue-500">
          Make sure to check your spam folder.
        </span>
        {/* <span className="text-xs text-blue-500">Links expire in 24 hours.</span> */}
      </div>

      {/* Convert guest to registered user */}
      <div className="border rounded-lg p-4 space-y-2">
        <p className="font-medium">Want to access your orders anytime?</p>
        <p className="text-sm text-gray-500">
          Create an account with the same email and your purchases will be
          linked automatically.
        </p>
        <Button asChild className="rounded-full w-full">
          <Link
            href={`/auth/signup`}
            className="block w-full bg-black text-white py-2 rounded-lg text-sm text-center"
          >
            Create an Account
          </Link>
        </Button>
      </div>

      <a href="/" className="text-sm text-gray-400 underline">
        Continue Shopping
      </a>
    </div>
  );
}
