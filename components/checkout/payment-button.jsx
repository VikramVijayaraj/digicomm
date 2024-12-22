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

  var initializeSDK = async function () {
    cashfree = await load({
      mode: "production",
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
        router.replace("/your/account/orders");
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
          toast.error("Some payment error occurred. Retry the payment!")
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
    <Button disabled={isProcessing} className="w-full" onClick={handleClick}>
      Pay now
    </Button>
  );
}
