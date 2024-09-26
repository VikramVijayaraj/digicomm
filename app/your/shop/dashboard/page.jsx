import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getShopDetails, verifySeller } from "@/lib/db/sellers";
import ShopDetailsForm from "@/components/shop/shop-details-form";

export default async function ShopDashboard() {
  const session = await auth();

  const result = await verifySeller(session?.user?.email);
  const isSeller = result[0]?.is_seller;

  if (!isSeller) {
    redirect("/your/shop/register");
  }

  const details = await getShopDetails(session?.user?.email);

  return (
    <div>
      <ShopDetailsForm session={session} data={details} />
    </div>
  );
}
