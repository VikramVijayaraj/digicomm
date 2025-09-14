"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, ShoppingCart, Store, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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
  const { setTheme } = useTheme();
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
        <Button variant="ghost" className="rounded-full">
          Sign in
        </Button>
      </Link>
    );
  } else {
    profileIcon = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={userData?.user?.image} />
            <AvatarFallback>{userData?.user?.email?.at(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{userData?.user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/your/account/orders">
            <DropdownMenuItem>Orders</DropdownMenuItem>
          </Link>
          <Link href="/your/account">
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>

          {/* Theme */}
          {/* <DropdownMenuSeparator />
          <div className="flex justify-evenly items-center">
            <DropdownMenuItem
              className="w-full flex justify-center"
              onClick={() => setTheme("light")}
            >
              <Sun size={20} />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full flex justify-center"
              onClick={() => setTheme("dark")}
            >
              <Moon size={20} />
            </DropdownMenuItem>
          </div> */}

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
        <Button variant="ghost" className="rounded-full md:py-6">
          <Store />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
    <div className="flex justify-center items-center space-x-4">
      <div>{profileIcon}</div>

      <div className="flex justify-center items-center space-x-2">
        {shopDetails && <div>{storeIcon}</div>}
        <div>
          <Button asChild variant="ghost" className="rounded-full md:py-6">
            <Link href="/your/cart">
              <ShoppingCart />
            </Link>
          </Button>
        </div>
      </div>

      {!shopDetails && (
        <div className="hidden md:block">
          <Button
            asChild
            className="h-[48px] text-[16px] p-[20px] rounded-full bg-gradient-to-r from-primary-brand
              to-red-400 text-white hover:from-primary-light hover:to-primary-brand
              hover:scale-105 transition-transform"
          >
            <Link href="/your/shop/register">Start Selling Now</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
