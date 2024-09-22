"use client";

import { useState } from "react";
import FormButton from "../form/form-button";
import Image from "next/image";

export default function PaymentOption() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handlePaymentChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };
  return (
    <form className="space-y-4" id="payment-form">
      <h2 className="text-xl font-semibold">Select Payment Option</h2>

      <div className="space-x-2 flex">
        <input
          type="radio"
          id="bank"
          name="paymentMethod"
          value="Bank"
          checked={selectedPaymentMethod === "Bank"}
          onChange={handlePaymentChange}
          required
        />
        <div className="flex space-x-2 items-center">
          <label for="bank">Bank</label>
          <Image src="/logos/visa.svg" width={40} height={40} alt="visa" />
          <Image
            src="/logos/mastercard.svg"
            width={30}
            height={30}
            alt="mastercard"
          />
          <Image src="/logos/paypal.svg" width={30} height={30} alt="paypal" />
        </div>
      </div>

      <div className="space-x-2">
        <input
          type="radio"
          id="cod"
          name="paymentMethod"
          value="Cash On Delivery"
          checked={selectedPaymentMethod === "Cash On Delivery"}
          onChange={handlePaymentChange}
        />
        <label for="cod">Cash On Delivery</label>
      </div>
      <p>Selected Payment Method: {selectedPaymentMethod}</p>

      <div className="w-52">
        <FormButton>Proceed to Payment</FormButton>
      </div>
    </form>
  );
}
