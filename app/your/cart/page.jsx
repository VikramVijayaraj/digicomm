import { redirect } from "next/navigation";
import { MoveRight } from "lucide-react";
import Link from "next/link";

import { getCartItems } from "@/lib/db/cart";
import OptimisticCart from "./optimistic-cart";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function CartPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("Error fetching user:", error.message);
    redirect("/auth/signin?callbackUrl=/your/cart");
  }

  // If no user is found, redirect to the sign-in page
  if (!data?.user) {
    redirect("/auth/signin?callbackUrl=/your/cart");
  }

  const cartItems = await getCartItems(data?.user.email);

  return (
    <div className="global-padding min-h-screen space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
        <h2 className="text-3xl">Your Cart</h2>
        {cartItems.length > 0 && (
          <Button asChild className="flex items-center gap-2 w-full md:w-fit">
            <Link href="/your/cart/checkout">
              Proceed to checkout <MoveRight />
            </Link>
          </Button>
        )}
      </div>
      <OptimisticCart initialCartItems={cartItems} />
    </div>
  );
}
