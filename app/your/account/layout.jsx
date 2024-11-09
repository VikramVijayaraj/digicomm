import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { accountTabs } from "@/lib/data";
import Sidebar from "@/components/ui/sidebar";

export const metadata = {
  title: "My Account",
  description: "My account settings.",
};

export default async function AccountLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="global-padding flex flex-col lg:flex-row min-h-screen gap-8 lg:gap-4">
      <div className="w-full lg:w-1/6">
        <Sidebar tabs={accountTabs} />
      </div>

      <div className="w-full lg:w-5/6">{children}</div>
    </div>
  );
}
