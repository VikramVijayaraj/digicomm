import { redirect } from "next/navigation";

import { auth } from "@/auth";
import ShopDetailsForm from "@/components/shop/shop-details-form";

export default async function RegisterShop() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div>
      <ShopDetailsForm />
    </div>
  );
}
