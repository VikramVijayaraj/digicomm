import { redirect } from "next/navigation";

import ShopDetailsForm from "@/components/shop/shop-details-form";
import { createClient } from "@/utils/supabase/server";

export default async function RegisterShop() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="global-padding w-full md:w-[80%] lg:w-[50%] m-auto space-y-16">
      <h2 className="text-2xl font-semibold text-center">Setup New Shop</h2>
      <ShopDetailsForm session={data} />
    </div>
  );
}
