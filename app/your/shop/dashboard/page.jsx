import { redirect } from "next/navigation";

import { getShopDetails, verifySeller } from "@/lib/db/sellers";
import { CardsSection } from "@/components/shop/dashboard/cards-section";
import { ChartSection } from "@/components/shop/dashboard/chart-section";
import { createClient } from "@/utils/supabase/server";
import ShopDetailsForm from "@/components/shop/shop-details-form";

export default async function ShopDashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const result = await verifySeller(data?.user?.email);
  const isSeller = result[0]?.is_seller;

  if (!isSeller) {
    redirect("/your/shop/register");
  }

  const details = await getShopDetails(data?.user?.email);

  return (
    // <div className="space-y-8">
    //   <CardsSection />
    //   <ChartSection />
    // </div>
    <div className="w-full lg:w-[80%]">
      <ShopDetailsForm session={data} data={details} />
    </div>
  );
}
