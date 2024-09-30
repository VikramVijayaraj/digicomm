import Link from "next/link";

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

export default async function Header() {
  const categories = await getCategories();
  const session = await auth();

  console.log("Printing from {header.js}");
  console.log(session);

  return (
    <header className="flex justify-between global-padding py-8 items-center gap-x-12">
      <div className="flex justify-between items-center gap-14">
        {/* Logo */}
        <Link href="/">
          <h1>{process.env.NEXT_PUBLIC_APP_NAME}</h1>
        </Link>

        {/* Categories */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="rounded-full">
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
      </div>

      {/* Search Icon */}
      <SearchBar placeholder="Search for anything" />

      {/* NavLinks */}
      <NavLinks session={session} />
    </header>
  );
}
