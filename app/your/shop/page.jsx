import { redirect } from "next/navigation";

import { auth } from "@/auth";
import NewShopForm from "@/components/shop/new-shop-form";

export default async function ShopPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div>
      <NewShopForm />
    </div>
  );
}
