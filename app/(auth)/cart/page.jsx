import { redirect } from "next/navigation";

import TableHeading from "@/components/cart/table-heading";
import CartTotal from "@/components/cart/cart-total";
import { getCartItems } from "@/lib/db/cart";
import { auth } from "@/auth";
import CartItem from "@/components/cart/cart-item";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const cartItems = await getCartItems(session?.user?.email);

  return (
    <div className="global-padding">
      <table className="w-full">
        <thead>
          <tr className="shadow-md rounded-sm">
            <TableHeading>Product</TableHeading>
            <TableHeading>Price</TableHeading>
            <TableHeading>Quanitity</TableHeading>
            <TableHeading>Subtotal</TableHeading>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.product_id}>
              <CartItem data={item} />
            </tr>
          ))}
        </tbody>
      </table>

      {/* Checkout */}
      <div className="w-1/3 m-auto">
        <CartTotal />
      </div>
    </div>
  );
}
