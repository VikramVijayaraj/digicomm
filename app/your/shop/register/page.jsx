import { redirect } from "next/navigation";

import { auth } from "@/auth";
import ShopDetailsForm from "@/components/shop/shop-details-form";

export default async function RegisterShop() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="global-padding w-full md:w-[80%] lg:w-[50%] m-auto space-y-16">
      <h2 className="text-2xl font-semibold text-center">Setup New Shop</h2>
      <ShopDetailsForm session={session} />
    </div>
  );
}
