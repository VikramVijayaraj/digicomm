import { redirect } from "next/navigation";

import CartTotal from "@/components/cart/cart-total";
import { getCartItems } from "@/lib/db/cart";
import { auth } from "@/auth";
import CartItem from "@/components/cart/cart-item";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const cartItems = await getCartItems(session?.user?.email);

  if (cartItems.length === 0) {
    return <p className="text-center min-h-screen">Cart is empty!</p>;
  }

  return (
    <div className="global-padding min-h-screen">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-center">Quanitity</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item.product_id}>
              <CartItem data={item} />
            </TableRow>
          ))}
          <TableRow></TableRow>
        </TableBody>
      </Table>

      {/* Checkout */}
      <div className="w-full lg:w-1/3 m-auto">
        <CartTotal />
      </div>
    </div>
  );
}
