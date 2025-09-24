import { redirect } from "next/navigation";

import { shopTabs } from "@/lib/data";
import Sidebar from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "My Shop Page",
  description: "My Shop Settings.",
};

export default async function ShopLayout({ children }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="global-padding flex flex-col lg:flex-row min-h-screen gap-8 lg:gap-4">
      <div className="w-full lg:w-1/6">
        <Sidebar tabs={shopTabs} />
      </div>

      <div className="w-full lg:w-5/6">{children}</div>
    </div>
  );
}
