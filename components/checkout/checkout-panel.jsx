"use client";

import { useState, useEffect, useRef } from "react";

import CartTotal from "@/components/cart/cart-total";
import PaymentButton from "@/components/checkout/payment-button";
import { createGuestUserAction } from "@/actions/user-actions";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPanel({
  isGuest,
  initialCustomerDetails,
  subTotal,
  action,
}) {
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [customerDetails, setCustomerDetails] = useState(
    initialCustomerDetails,
  );
  const guestUserIdRef = useRef(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (isGuest) {
      setCustomerDetails({
        customer_id: guestUserIdRef.current || "temp-guest",
        customer_name: guestDetails.name,
        customer_email: guestDetails.email,
        customer_phone: guestDetails.phone,
      });
    } else {
      setCustomerDetails(initialCustomerDetails);
    }
  }, [isGuest, guestDetails, initialCustomerDetails]);

  const isGuestFormComplete =
    !isGuest ||
    (guestDetails.name.trim() &&
      guestDetails.email.trim() &&
      guestDetails.phone.trim());

  // Called by PaymentButton just before initiating payment
  async function handleBeforePayment() {
    if (!isGuest) return;

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestDetails.email.trim())) {
      setEmailError("Please enter a valid email address.");
      throw new Error("Invalid email address.");
    }
    setEmailError("");

    // Validate phone number
    if (!/^\d{10}$/.test(guestDetails.phone.trim())) {
      setPhoneError("Phone number must be exactly 10 digits.");
      throw new Error("Invalid phone number.");
    }
    setPhoneError("");

    setIsCreatingUser(true);
    try {
      const result = await createGuestUserAction({
        username: guestDetails.name,
        email: guestDetails.email,
        phone: guestDetails.phone,
      });

      if (result?.id) {
        guestUserIdRef.current = result.id;
      } else {
        throw new Error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Please try again.");
      throw error;
    } finally {
      setIsCreatingUser(false);
    }
  }

  // Wrapper function to pass guest user ID to the payment success handler
  async function handlePaymentAction(orderId) {
    return action(orderId, guestUserIdRef.current, guestDetails.email);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
      {/* Left column */}
      <div className={isGuest ? "lg:col-span-7" : "lg:col-span-8"}>
        {isGuest ? (
          <Card>
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
              <CardDescription>
                We’ll send your order confirmation and download link to this
                email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="guest-name">Full name</Label>
                  <Input
                    id="guest-name"
                    type="text"
                    placeholder="Jane Doe"
                    value={guestDetails.name}
                    onChange={(e) =>
                      setGuestDetails((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    disabled={isCreatingUser}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guest-email">Email address</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={guestDetails.email}
                    onChange={(e) => {
                      setGuestDetails((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                      if (emailError) setEmailError(""); // clear error on change
                    }}
                    disabled={isCreatingUser}
                    className={
                      emailError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {emailError && (
                    <p className="text-xs text-red-500">{emailError}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guest-phone">Phone number</Label>
                  <Input
                    id="guest-phone"
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={guestDetails.phone}
                    onChange={(e) => {
                      // Only allow digits
                      const value = e.target.value.replace(/\D/g, "");
                      setGuestDetails((prev) => ({ ...prev, phone: value }));
                      if (phoneError) setPhoneError(""); // clear error on change
                    }}
                    disabled={isCreatingUser}
                    className={
                      phoneError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {phoneError && (
                    <p className="text-xs text-red-500">{phoneError}</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-muted-foreground">
              <p className="text-xs">
                🔒 Secure checkout powered by Cashfree Payments
              </p>
              <p className="text-xs">
                No hidden charges. Instant access after payment.
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Review your details</CardTitle>
              <CardDescription>
                We’ll use these for your invoice and order updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">
                    {customerDetails?.customer_name || "—"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">
                    {customerDetails?.customer_email || "—"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">
                    {customerDetails?.customer_phone || "—"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right column */}
      <div className={isGuest ? "lg:col-span-5" : "lg:col-span-4"}>
        <Card className="lg:sticky lg:top-24">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CartTotal subTotal={subTotal} showTitle={false} />
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <PaymentButton
              orderAmount={subTotal}
              customerDetails={customerDetails}
              action={handlePaymentAction}
              guestPayment={isGuest}
              disabled={!isGuestFormComplete || isCreatingUser}
              beforePayment={handleBeforePayment}
            />
            <p className="text-xs text-muted-foreground text-center w-full">
              By placing this order, you agree to our Terms & Refund Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
