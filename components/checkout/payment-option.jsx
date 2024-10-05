"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "../ui/button";

export default function PaymentOption({ totalAmount }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handlePaymentChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };
  return (
    <div className="lg:w-1/2">
      <form className="p-4 space-y-4" id="payment-form">
        <h2 className="text-xl font-semibold">Select Payment Method</h2>

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
            <label htmlFor="bank">Bank</label>
            <Image src="/logos/visa.svg" width={40} height={40} alt="visa" />
            <Image
              src="/logos/mastercard.svg"
              width={30}
              height={30}
              alt="mastercard"
            />
            <Image
              src="/logos/paypal.svg"
              width={30}
              height={30}
              alt="paypal"
            />
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
          <label htmlFor="cod">Cash On Delivery</label>
        </div>
        <br />
        <p>Selected Payment Method: {selectedPaymentMethod}</p>
        <br />
        <Button className="w-full lg:w-[50%]">
          Pay <span className="font-semibold ml-2">₹{totalAmount}</span>
        </Button>
      </form>
    </div>
  );
}
