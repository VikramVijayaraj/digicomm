import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";

import { auth } from "@/auth";
import NavLinks from "./nav-links";
import { getCategories } from "@/lib/db/categories";
import SearchBar from "./search-bar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "../ui/label";

export default async function Header() {
  const categories = await getCategories();
  const session = await auth();

  console.log("Printing from {header.js}");
  console.log(session);

  return (
    <>
      <header className="flex justify-between global-padding py-8 items-center gap-x-12">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-xl">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
        </Link>

        {/* For lg and above screen sizes */}
        <div className="hidden lg:flex w-full gap-4">
          {/* Categories */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="rounded-full text-base font-normal">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category) => (
                      <Link
                        href={"/categories/" + category.slug}
                        className="p-2 rounded-md hover:bg-secondary"
                        key={category.slug}
                      >
                        <li className="">{category.name}</li>
                      </Link>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Icon */}
          <SearchBar placeholder="Search for anything" />
        </div>

        {/* NavLinks */}
        <NavLinks session={session} />
      </header>

      {/* For md and sm screen sizes */}
      <div className="global-padding flex gap-4 lg:hidden">
        {/* Categories */}
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-left">Browse Categories</SheetTitle>
            </SheetHeader>
            <Label className="hover:bg-secondary">
              {categories.map((category) => (
                <SheetClose asChild key={category.slug}>
                  <Link
                    href={"/categories/" + category.slug}
                    className="py-2 flex justify-between items-center hover:underline"
                    key={category.slug}
                  >
                    {category.name} <ChevronRight />
                  </Link>
                </SheetClose>
              ))}
            </Label>
          </SheetContent>
        </Sheet>

        {/* Search Icon */}
        <SearchBar placeholder="Search for anything" />
      </div>
    </>
  );
}
