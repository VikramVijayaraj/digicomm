import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ShieldCheck } from "lucide-react";

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
    <div className="global-padding min-h-screen space-y-6 pb-10">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Checkout
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Complete your purchase
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Confirm your details and finish payment securely.
          </p>
        </div>
      </section>

      <CheckoutPanel
        isGuest={isGuest}
        initialCustomerDetails={customerDetails}
        subTotal={subTotal}
        action={handlePaymentSuccess}
      />
    </div>
  );
}
