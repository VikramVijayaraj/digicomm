import Link from "next/link";
import { FaBars } from "react-icons/fa6";

import { auth } from "@/auth";
import NavLinks from "./nav-links";
import Dropdown from "./dropdown";
import { getCategories } from "@/lib/db/categories";
import Search from "./search";

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
        <Dropdown data={categories} parent="/categories/">
          <FaBars />
          <p>Categories</p>
        </Dropdown>
      </div>

      {/* Search Icon */}
      <Search placeholder="Search for anything" />

      {/* NavLinks */}
      <NavLinks session={session} />
    </header>
  );
}
