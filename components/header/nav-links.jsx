"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Store } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOut } from "@/actions/auth-actions";

export default function NavLinks({ userData, shopDetails }) {
  const router = useRouter();

  let profileIcon;
  let storeIcon;

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  if (!userData?.user) {
    profileIcon = (
      <Link href="/auth/signin">
        <Button
          variant="outline"
          className="h-11 rounded-full border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Sign in
        </Button>
      </Link>
    );
  } else {
    profileIcon = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-11 w-11 cursor-pointer border border-slate-200">
            <AvatarImage src={userData?.user?.user_metadata.avatar_url} />
            <AvatarFallback className="bg-slate-100 text-slate-700">
              {userData?.user?.email?.at(0)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-2xl border-slate-200 p-2"
        >
          <DropdownMenuLabel className="text-slate-600">
            {userData?.user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/your/account/orders">
            <DropdownMenuItem>Orders</DropdownMenuItem>
          </Link>
          <Link href="/your/account">
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <Link href="/">
            <DropdownMenuItem onClick={handleSignOut}>
              {/* <DropdownMenuItem onClick={() => handleSignOut()}> */}
              Sign out
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  storeIcon = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          <Store className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-2xl border-slate-200 p-2"
      >
        <DropdownMenuLabel>Shop</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {shopDetails ? (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/shop/${shopDetails.shop_slug}`}>Storefront</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/your/shop/dashboard">Settings</Link>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/your/shop/register">Setup Shop</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex items-center gap-3">
      <div>{profileIcon}</div>

      <div className="flex items-center gap-2">
        {shopDetails && <div>{storeIcon}</div>}
        <div>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <Link href="/your/cart">
              <ShoppingCart className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {!shopDetails && (
        <div className="hidden md:block">
          <Button
            asChild
            className="h-11 rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-5 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
          >
            <Link href="/your/shop/register">Start Selling</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
