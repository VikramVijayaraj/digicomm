import { auth } from "@/auth";
import CartTotal from "@/components/cart/cart-total";
import PaymentButton from "@/components/checkout/payment-button";
import { getCartItems } from "@/lib/db/cart";
import { createOrder } from "@/lib/db/orders";
import { getUserByEmail, getUserDetailsByEmail } from "@/lib/db/users";

export default async function Checkout() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const user = await getUserDetailsByEmail(session?.user?.email);
  const cartItems = await getCartItems(session?.user?.email);

  const subTotal = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const customerDetails = {
    customer_id: user[0].id,
    customer_name: user[0].first_name,
    customer_email: user[0].email,
    customer_phone: user[0].phone,
  };

  async function handlePaymentSuccess(orderId) {
    "use server";
    await createOrder(user[0].id, orderId, subTotal, cartItems);
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
