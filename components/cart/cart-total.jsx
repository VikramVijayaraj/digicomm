"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";

export default function CartTotal({ page }) {
  const cartItems = useSelector((state) => state.cart.items);
  const pathname = usePathname();

  const subTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="border border-gray-300 rounded-sm p-8 w-full mt-8">
      <h4 className="font-bold text-xl">Cart Total</h4>

      {/* Cart Summary */}
      <div className="flex justify-between items-center py-2">
        <p>Subtotal:</p>
        <p>${subTotal.toFixed(2)}</p>
      </div>
      <div className="flex justify-between items-center py-2">
        <p>Shipping fee:</p>
        <p>$0</p>
      </div>
      <div className="flex justify-between items-center py-2">
        <p>Total:</p>
        <p>${subTotal.toFixed(2)}</p>
      </div>

      {/* Proceed To Checkout */}
      {page !== "checkout" && (
        <Button asChild className="w-full">
          <Link href={`${pathname}/checkout`}>Proceed to checkout</Link>
        </Button>
      )}
    </div>
  );
}
