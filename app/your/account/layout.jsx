import { redirect } from "next/navigation";

import { accountTabs } from "@/lib/data";
import Sidebar from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "My Account",
  description: "My account settings.",
};

export default async function AccountLayout({ children }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="global-padding grid min-h-screen gap-4 pb-10 sm:gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
      <aside className="min-w-0">
        <Sidebar tabs={accountTabs} />
      </aside>

      <main className="min-w-0">{children}</main>
    </div>
  );
}
