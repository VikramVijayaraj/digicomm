import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { fetchPaymentDetails } from "@/lib/api";
import { getCartItems, getGuestCart } from "@/lib/db/cart";
import { createOrder, createPayment } from "@/lib/db/orders";
import { getUserDetailsByEmail } from "@/lib/db/users";
import { removeCartAction, deleteGuestCartAction } from "@/actions/cart-action";
import { createClient } from "@/utils/supabase/server";
import CheckoutPanel from "@/components/checkout/checkout-panel";
import { sendProductDownloadEmail } from "@/actions/send-email-action";

export default async function Checkout() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  let cartItems = [];
  let customerDetails = null;
  let userId = null;
  let isGuest = false;

  if (!data?.user) {
    isGuest = true;
    const guestCart = await getGuestCart();
    if (!guestCart || guestCart.length === 0) redirect("/your/cart");
    cartItems = guestCart;
  } else {
    cartItems = await getCartItems(data?.user?.email);
    const user = await getUserDetailsByEmail(data?.user?.email);
    if (user.length === 0) redirect("/register?callback=/your/cart/checkout");

    userId = user[0].id;
    customerDetails = {
      customer_id: userId,
      customer_name: user[0].first_name,
      customer_email: user[0].email,
      customer_phone: user[0].phone,
    };
  }

  const subTotal = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  async function handlePaymentSuccess(orderId, guestUserId, guestEmail) {
    "use server";
    // Use guest user ID if available, otherwise use authenticated user ID
    const finalUserId = guestUserId || userId;

    await createOrder(finalUserId, orderId, subTotal, cartItems);

    // Create a payment record in the database
    const response = await fetchPaymentDetails(orderId);
    const paymentDetails = {
      orderId,
      userId: finalUserId,
      amount: response[0].payment_amount,
      paymentMethod: response[0].payment_group,
      status: response[0].payment_status,
      transactionId: response[0].cf_payment_id,
    };
    await createPayment(paymentDetails);

    if (isGuest) {
      const result = await sendProductDownloadEmail({ email: guestEmail });
      if (result.success) {
        console.log(
          "Product download email sent successfully to " + guestEmail,
        );
      } else {
        console.error(result.error);
      }

      await deleteGuestCartAction();
    } else {
      await removeCartAction(cartItems[0].cart_id);
    }

    revalidatePath("/your/cart");
    revalidatePath("/your/account/orders");
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Checkout
        </h1>
        <p className="text-muted-foreground mt-1">
          Secure checkout. No hidden fees.
        </p>
      </div>

      <CheckoutPanel
        isGuest={isGuest}
        initialCustomerDetails={customerDetails}
        subTotal={subTotal}
        action={handlePaymentSuccess}
      />
    </div>
  );
}
