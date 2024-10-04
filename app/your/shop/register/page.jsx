import { redirect } from "next/navigation";

import { auth } from "@/auth";
import ShopDetailsForm from "@/components/shop/shop-details-form";

export default async function RegisterShop() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="max-w-md m-auto space-y-8">
      <h2 className="text-2xl font-semibold text-center">Setup New Shop</h2>
      <ShopDetailsForm session={session} />
    </div>
  );
}
