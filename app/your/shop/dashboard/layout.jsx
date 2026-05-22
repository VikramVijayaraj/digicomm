import { redirect } from "next/navigation";

import { shopTabs } from "@/lib/data";
import Sidebar from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { verifySeller } from "@/lib/db/sellers";

export const metadata = {
  title: "Your Shop Dashboard",
  description: "Manage your shop and products",
};

export default async function ShopLayout({ children }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  const result = await verifySeller(data?.user?.email);
  const isSeller = result[0]?.is_seller;

  if (!isSeller) {
    redirect("/your/shop/register");
  }

  return (
    <div className="global-padding grid lg:min-h-screen gap-4 pb-10 sm:gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
      <aside className="min-w-0">
        <Sidebar tabs={shopTabs} />
      </aside>

      <main className="min-w-0">{children}</main>
    </div>
  );
}
