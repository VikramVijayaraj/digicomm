import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";

import NavLinks from "./nav-links";
import Dropdown from "./dropdown";
import { categories } from "@/lib/data";
import { verifyAuth } from "@/lib/auth/auth";

export default async function Header() {
  // const isLoggedin = await verifyAuth();

  return (
    <header className="flex justify-between global-padding py-8 items-center gap-x-12">
      <div className="flex justify-between items-center gap-14">
        {/* Logo */}
        <Link href="/">
          <h1>{process.env.NEXT_PUBLIC_APP_NAME}</h1>
        </Link>

        {/* Categories */}
        <Dropdown data={categories}>
          <FaBars />
          <p>Categories</p>
        </Dropdown>
      </div>

      {/* Search Icon */}
      <div className="flex justify-between rounded-full px-8 py-4 items-center bg-gray-100 grow">
        <input
          className="bg-gray-100 w-full outline-none"
          type="text"
          placeholder="Search for anything"
        />
        <FaSearch className="text-gray-500 cursor-pointer" />
      </div>

      {/* NavLinks */}
      <NavLinks
      // isAuthenticated={isLoggedin}
      />
    </header>
  );
}
