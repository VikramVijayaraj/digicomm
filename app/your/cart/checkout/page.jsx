import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import CartTotal from "@/components/cart/cart-total";
import PaymentButton from "@/components/checkout/payment-button";
import { fetchPaymentDetails } from "@/lib/api";
import { getCartItems, removeCart } from "@/lib/db/cart";
import { createOrder, createPayment } from "@/lib/db/orders";
import { getUserDetailsByEmail } from "@/lib/db/users";

export default async function Checkout() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  revalidatePath("/");

  const user = await getUserDetailsByEmail(session?.user?.email);
  const cartItems = await getCartItems(session?.user?.email);

  if (user.length === 0) {
    redirect("/register?callback=/your/cart/checkout");
  }

  const subTotal = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const userId = user[0].id;

  const customerDetails = {
    customer_id: userId,
    customer_name: user[0].first_name,
    customer_email: user[0].email,
    customer_phone: user[0].phone,
  };

  async function handlePaymentSuccess(orderId) {
    "use server";
    await createOrder(userId, orderId, subTotal, cartItems);

    // Create a payment record in the database
    const response = await fetchPaymentDetails(orderId);
    const paymentDetails = {
      orderId,
      userId,
      amount: response[0].payment_amount,
      paymentMethod: response[0].payment_group,
      status: response[0].payment_status,
      transactionId: response[0].cf_payment_id,
    };
    await createPayment(paymentDetails);

    // Clean up the cart after the payment
    await removeCart(cartItems[0].cart_id);
  }

  return (
    <div
      className="global-padding min-h-screen mt-5 md:mt-10 lg:mt-20 space-y-4 m-auto w-full
        md:max-w-lg lg:max-w-xl xl:max-w-2xl"
    >
      <CartTotal subTotal={subTotal} />
      <PaymentButton
        orderAmount={subTotal}
        customerDetails={customerDetails}
        action={handlePaymentSuccess}
      />
    </div>
  );
}
