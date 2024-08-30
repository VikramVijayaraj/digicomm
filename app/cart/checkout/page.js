"use client";

import CartTotal from "@/components/cart/cart-total";
import CheckoutForm from "@/components/checkout/checkout-form";
import PaymentOption from "@/components/checkout/payment-option";

export default function Checkout() {
  return (
    <div className="global-padding py-10 flex justify-between">
      {/* Billing Details */}
      <CheckoutForm />

      {/* Summary and Payment */}
      <div className="w-full">
        <div className="w-2/3">
          <CartTotal page="checkout" />
        </div>

        <div className="p-8">
        <PaymentOption />
        </div>
      </div>
    </div>
  );
}
