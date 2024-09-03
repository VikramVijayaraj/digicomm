import { redirect } from "next/navigation";

import { verifyAuth } from "@/lib/auth/auth";
import CheckoutForm from "@/components/checkout/checkout-form";

export default async function AccountPage() {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/authenticate");
  }

  return (
    <div>
      <CheckoutForm />
    </div>
  );
}
