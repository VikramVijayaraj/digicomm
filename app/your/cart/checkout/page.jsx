import { auth } from "@/auth";
import CartTotal from "@/components/cart/cart-total";
import PaymentOption from "@/components/checkout/payment-option";
import { getCartItems } from "@/lib/db/cart";

export default async function Checkout() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const cartItems = await getCartItems(session?.user?.email);

  const subTotal = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div
      className="global-padding flex flex-col lg:flex-row lg:justify-between lg:gap-12 xl:gap-20
        xl:px-72"
    >
      <CartTotal subTotal={subTotal} />
      <PaymentOption totalAmount={subTotal} />
    </div>
  );
}
