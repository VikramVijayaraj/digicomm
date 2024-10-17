"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function PaymentButton({
  orderAmount,
  customerDetails,
  action,
}) {
  const orderIdRef = useRef("");
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  let cashfree;

  async function initializeSDK() {
    cashfree = await load({
      mode: "sandbox",
    });
  }
  initializeSDK();

  async function getSessionId() {
    try {
      const res = await axios.post("/api/payment", {
        orderAmount,
        customerDetails,
      });

      if (res.data && res.data.payment_session_id) {
        orderIdRef.current = res.data.order_id;
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function confirmPayment() {
    setIsProcessing(true);
    try {
      const orderId = orderIdRef.current;
      const res = await axios.post("/api/confirm", { orderId });

      if (res.data && res.data.order_status == "PAID") {
        router.replace("/your/account/orders");
        await action(orderId);
        router.refresh();
        toast.success(`Payment Successful!`);
      } else {
        toast.error("Payment failed!");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleClick(event) {
    event.preventDefault();

    try {
      const sessionId = await getSessionId();
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      cashfree
        .checkout(checkoutOptions)
        .then(() => {
          console.log("Payment initiated successfully!");
          confirmPayment();
        })
        .catch((error) => {
          console.error("Payment initiation failed:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <Button disabled={isProcessing} className="w-full" onClick={handleClick}>
      Pay now
    </Button>
  );
}
