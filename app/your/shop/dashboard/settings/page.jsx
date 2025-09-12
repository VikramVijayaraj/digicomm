import { auth } from "@/auth";
import { getShopDetails } from "@/lib/db/sellers";
import ShopDetailsForm from "@/components/shop/shop-details-form";

export default async function ShopSettingsPage() {
  const session = await auth();

  const details = await getShopDetails(session?.user?.email);

  return (
    <div className="w-full lg:w-[80%]">
      <ShopDetailsForm session={session} data={details} />
    </div>
  );
}
