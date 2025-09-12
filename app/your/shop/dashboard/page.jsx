import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getShopDetails, verifySeller } from "@/lib/db/sellers";
import { CardsSection } from "@/components/shop/dashboard/cards-section";
import { ChartSection } from "@/components/shop/dashboard/chart-section";

export default async function ShopDashboard() {
  const session = await auth();

  const result = await verifySeller(session?.user?.email);
  const isSeller = result[0]?.is_seller;

  if (!isSeller) {
    redirect("/your/shop/register");
  }

  const details = await getShopDetails(session?.user?.email);
  console.log(details);
  return (
    <div className="space-y-8">
      <CardsSection />
      <ChartSection />
    </div>
  );
}
