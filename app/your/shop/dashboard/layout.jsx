import { auth } from "@/auth";
import ShopSidebar from "@/components/shop/shop-sidebar";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Shop",
  description: "My Shop Settings.",
};

export default async function ShopLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="global-padding flex min-h-screen gap-4">
      <div className="w-1/6">
        <ShopSidebar />
      </div>

      <div className="w-5/6">{children}</div>
    </div>
  );
}
