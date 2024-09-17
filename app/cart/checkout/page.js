"use client";

import CartTotal from "@/components/cart/cart-total";
// import CheckoutForm from "@/components/checkout/checkout-form";
import PaymentOption from "@/components/checkout/payment-option";

export default function Checkout() {
  return (
    <div className="global-padding py-10 flex justify-evenly gap-x-4">
      {/* Billing Details */}
      <div className="w-1/3">
        {/* <CheckoutForm /> */}
      </div>

      {/* Summary and Payment */}
      <div className="w-1/3">
        {/* <div className="w-2/3"> */}
          <CartTotal page="checkout" />
        {/* </div> */}

        <div className="p-8">
          <PaymentOption />
        </div>
      </div>
    </div>
  );
}
