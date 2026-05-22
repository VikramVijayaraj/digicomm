import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import Image from "next/image";

import NavLinks from "./nav-links";
import { getCategories } from "@/lib/db/categories";
import HeaderSearch from "./header-search";
import MobileSearchRow from "./mobile-search-row";
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
import { getShopDetails } from "@/lib/db/sellers";
import { createClient } from "@/utils/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const categories = await getCategories();
  // Get shop details only if user is authenticated
  const shopDetails = userData?.user?.email
    ? await getShopDetails(userData.user.email)
    : null;

  return (
    <>
      <header className="global-padding relative z-50 pt-6">
        <div className="relative z-50 flex items-center justify-between gap-4 rounded-[1.75rem] bg-white/90 px-4 py-4 md:px-5 lg:px-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors hover:bg-slate-50">
                  <Menu className="h-5 w-5 text-slate-700" />
                </SheetTrigger>
                <SheetContent side="left" className="border-slate-200 bg-white">
                  <SheetHeader className="mb-4">
                    <SheetTitle className="text-left text-slate-950">
                      Browse Categories
                    </SheetTitle>
                  </SheetHeader>
                  <Label className="space-y-2">
                    {categories.map((category) => (
                      <SheetClose asChild key={category.slug}>
                        <Link
                          href={"/categories/" + category.slug}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          key={category.slug}
                        >
                          {category.name} <ChevronRight className="h-4 w-4" />
                        </Link>
                      </SheetClose>
                    ))}
                  </Label>
                </SheetContent>
              </Sheet>
            </div>

            <Link
              href="/"
              className="flex shrink-0 items-center rounded-full transition-opacity hover:opacity-90"
            >
              <Image
                src="/logos/crelands.png"
                alt="Crelands Logo"
                width={120}
                height={20}
                className="h-5 sm:h-6 w-auto object-contain lg:h-7"
                priority
                unoptimized
              />
            </Link>

            <div className="hidden lg:flex items-center gap-3">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="rounded-full border border-slate-200 bg-slate-50 px-5 text-sm font-medium text-slate-700 hover:bg-slate-100 data-[state=open]:bg-slate-100">
                      Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[420px] gap-2 p-4 md:w-[520px] md:grid-cols-2 lg:w-[620px]">
                        {categories.map((category) => (
                          <Link
                            href={"/categories/" + category.slug}
                            className="rounded-xl border border-transparent p-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-200 hover:bg-slate-50"
                            key={category.slug}
                          >
                            <li>{category.name}</li>
                          </Link>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <HeaderSearch
                placeholder="Search for anything"
                className="w-[360px] xl:w-[430px]"
              />
            </div>
          </div>

          <NavLinks userData={userData} shopDetails={shopDetails} />
        </div>
      </header>

      <MobileSearchRow placeholder="Search for anything" />
    </>
  );
}
