"use client";

import Link from "next/link";
import { Moon, ShoppingCart, Store, Sun } from "lucide-react";
import { signOut } from "next-auth/react";
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
import { handleSignOut } from "@/actions/auth-actions";

export default function NavLinks({ session, shopDetails }) {
  const { setTheme } = useTheme();

  let profileIcon;
  let storeIcon;

  if (!session?.user) {
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
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={session?.user?.image} />
            <AvatarFallback>{session?.user?.email?.at(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session?.user.email}</DropdownMenuLabel>
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
          {/* <DropdownMenuSeparator /> */}
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
            <DropdownMenuItem onClick={() => signOut()}>
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
      <DropdownMenuTrigger asChild className="">
        <Button variant="ghost" className="rounded-full">
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
            <Link href={"/your/shop/register"}>Setup Shop</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex justify-center items-center space-x-4">
      <div>{profileIcon}</div>
      <div>{storeIcon}</div>
      <div>
        <Button asChild variant="ghost" className="rounded-full">
          <Link href="/your/cart">
            <ShoppingCart />
          </Link>
        </Button>
      </div>
    </div>
  );
}
