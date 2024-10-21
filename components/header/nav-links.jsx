"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
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

export default function NavLinks({ session }) {
  const { setTheme } = useTheme();

  let navLink;

  if (!session?.user) {
    navLink = (
      <Link href="/signin">
        <Button variant="ghost" className="rounded-full">
          Sign in
        </Button>
      </Link>
    );
  } else {
    navLink = (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={session?.user?.image} />
            <AvatarFallback>{session?.user?.name.at(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
          {/* <DropdownMenuSeparator /> */}
          <Link href="/your/account">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href="/your/shop/dashboard">
            <DropdownMenuItem>My Shop</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href="/">
            <DropdownMenuItem onClick={() => signOut()}>
              Sign out
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex justify-center items-center space-x-4">
      <div>{navLink}</div>

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
