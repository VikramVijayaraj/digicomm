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
  guestPayment,
  disabled,
  beforePayment,
}) {
  const orderIdRef = useRef("");
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  let cashfree;

  var initializeSDK = async function () {
    cashfree = await load({
      mode: "production", // "production" or "sandbox"
    });
  };
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

      let getOrderResponse = res.data;
      let orderStatus;

      if (
        getOrderResponse.filter(
          (transaction) => transaction.payment_status === "SUCCESS",
        ).length > 0
      ) {
        orderStatus = "Success";

        if (guestPayment) {
          router.replace(
            `/guest/orders/confirmation?orderId=${orderId}&email=${customerDetails.customer_email}`,
          );
        } else {
          router.replace("/your/account/orders");
        }
        await action(orderId);
        router.refresh();
        toast.success(`Payment Successful!`);
      } else if (
        getOrderResponse.filter(
          (transaction) => transaction.payment_status === "PENDING",
        ).length > 0
      ) {
        orderStatus = "Pending";
      } else {
        orderStatus = "Failure";
        toast.error("Payment failed!");
        router.refresh();
      }

      // if (res.data && res.data.order_status == "PAID") {
      //   router.replace("/your/account/orders");
      //   await action(orderId);
      //   router.refresh();
      //   toast.success(`Payment Successful!`);
      // } else {
      //   toast.error("Payment failed!");
      //   router.refresh();
      // }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleClick(event) {
    event.preventDefault();

    try {
      await beforePayment();
      const sessionId = await getSessionId();
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then((result) => {
        if (result.error) {
          // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
          console.log(
            "User has closed the popup or there is some payment error, Check for Payment Status",
          );
          console.log(result.error);
          toast.error("Some payment error occurred. Retry the payment!");
        }
        if (result.redirect) {
          // This will be true when the payment redirection page couldnt be opened in the same window
          // This is an exceptional case only when the page is opened inside an inAppBrowser
          // In this case the customer will be redirected to return url once payment is completed
          console.log("Payment will be redirected");
        }
        if (result.paymentDetails) {
          // This will be called whenever the payment is completed irrespective of transaction status
          // console.log("Payment has been completed, Check for Payment Status");
          // console.log(result.paymentDetails.paymentMessage);
          confirmPayment();
        }
      });

      // cashfree
      //   .checkout(checkoutOptions)
      //   .then(() => {
      //     console.log("Payment initiated successfully!");
      //     confirmPayment();
      //   })
      //   .catch((error) => {
      //     console.error("Payment initiation failed:", error);
      //   });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <Button
      disabled={isProcessing || disabled}
      className="w-full h-11 text-base"
      onClick={handleClick}
    >
      {isProcessing ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Processing…
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a3 3 0 00-3 3V6H6.75A2.25 2.25 0 004.5 8.25v9A2.25 2.25 0 006.75 19.5h10.5A2.25 2.25 0 0019.5 17.25v-9A2.25 2.25 0 0017.25 6H15V4.5a3 3 0 00-3-3zm-1.5 3a1.5 1.5 0 013 0V6h-3V4.5zM6 9.75A.75.75 0 016.75 9h10.5a.75.75 0 01.75.75V12H6V9.75zm0 3.75h12v3.75a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V13.5z"
              clipRule="evenodd"
            />
          </svg>
          Pay now
        </span>
      )}
    </Button>
  );
}
