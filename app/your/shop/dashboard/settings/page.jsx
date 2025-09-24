import { getShopDetails } from "@/lib/db/sellers";
import ShopDetailsForm from "@/components/shop/shop-details-form";
import { createClient } from "@/utils/supabase/server";

export default async function ShopSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const details = await getShopDetails(data?.user?.email);

  return (
    <div className="w-full lg:w-[80%]">
      <ShopDetailsForm session={data} data={details} />
    </div>
  );
}
