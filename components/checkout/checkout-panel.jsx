"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Mail, Phone, ShieldCheck, UserRound, Wallet } from "lucide-react";
import { toast } from "sonner";

import CartTotal from "@/components/cart/cart-total";
import PaymentButton from "@/components/checkout/payment-button";
import { createGuestUserAction } from "@/actions/user-actions";
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
      <div className={isGuest ? "lg:col-span-7" : "lg:col-span-8"}>
        {isGuest ? (
          <Card className="rounded-[1.75rem] border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <CardHeader className="p-5 sm:p-6">
              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                <UserRound className="h-4 w-4" />
                Guest details
              </div>
              <CardTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Contact details
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                We’ll send your order confirmation and download link to this
                email.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="guest-name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </Label>
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
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="guest-email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </Label>
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
                        ? "h-14 rounded-2xl border-red-500 bg-slate-50 px-4 text-base shadow-none focus-visible:ring-red-500"
                        : "h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                    }
                  />
                  {emailError && (
                    <p className="text-xs font-medium text-red-500">
                      {emailError}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="guest-phone"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Phone number
                  </Label>
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
                        ? "h-14 rounded-2xl border-red-500 bg-slate-50 px-4 text-base shadow-none focus-visible:ring-red-500"
                        : "h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                    }
                  />
                  {phoneError && (
                    <p className="text-xs font-medium text-red-500">
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 border-t border-slate-200 px-5 py-4 text-slate-500 sm:px-6">
              <p className="inline-flex items-center gap-2 text-xs font-medium">
                <ShieldCheck className="h-4 w-4 text-primary-brand" />
                Secure checkout powered by Cashfree Payments
              </p>
              <p className="text-xs leading-5">
                No hidden charges. Instant access after payment.
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card className="rounded-[1.75rem] border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <CardHeader className="p-5 sm:p-6">
              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                <UserRound className="h-4 w-4" />
                Buyer details
              </div>
              <CardTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Review your details
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                We’ll use these for your invoice and order updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                <div className="flex items-center justify-between gap-4 px-4 py-4">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                    <UserRound className="h-4 w-4" />
                    Name
                  </span>
                  <span className="text-right text-sm font-semibold text-slate-950">
                    {customerDetails?.customer_name || "—"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4 px-4 py-4">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Mail className="h-4 w-4" />
                    Email
                  </span>
                  <span className="min-w-0 break-all text-right text-sm font-semibold text-slate-950">
                    {customerDetails?.customer_email || "—"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4 px-4 py-4">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Phone className="h-4 w-4" />
                    Phone
                  </span>
                  <span className="text-right text-sm font-semibold text-slate-950">
                    {customerDetails?.customer_phone || "—"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className={isGuest ? "lg:col-span-5" : "lg:col-span-4"}>
        <Card className="rounded-[1.75rem] border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)] lg:sticky lg:top-24">
          <CardHeader className="p-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
              <Wallet className="h-4 w-4" />
              Payment
            </div>
            <CardTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Order summary
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pt-0 sm:px-6">
            <CartTotal subTotal={subTotal} showTitle={false} />
          </CardContent>
          <CardFooter className="flex-col gap-3 px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
            <PaymentButton
              orderAmount={subTotal}
              customerDetails={customerDetails}
              action={handlePaymentAction}
              guestPayment={isGuest}
              disabled={!isGuestFormComplete || isCreatingUser}
              beforePayment={handleBeforePayment}
            />
            <p className="w-full text-center text-xs leading-5 text-slate-500">
              By placing this order, you agree to our{" "}
              <Link
                href="/refunds-and-returns-policy"
                className="hover:underline"
              >
                Refunds and Returns
              </Link>{" "}
              Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
