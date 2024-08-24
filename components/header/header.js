"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";

import { categories } from "@/lib/data";

const navLinks = [
  // { name: "Contact", href: "/contact" },
  // { name: "About", href: "/about" },
  { name: "Sign in", href: "/signup" },
  { name: <BsCart4 className="text-xl" />, href: "/cart" },
];

export default function Header() {
  const pathname = usePathname();
  const [isCategoriesOpen, SetIsCategoriesOpen] = useState(false);

  function handleCategory() {
    SetIsCategoriesOpen(!isCategoriesOpen);
  }

  return (
    <header className="flex justify-between global-padding py-8 items-center gap-x-12">
      <div className="flex justify-between items-center gap-14">
        {/* Logo */}
        <Link href="/">
          <h1>{process.env.NEXT_PUBLIC_APP_NAME}</h1>
        </Link>

        {/* Categories */}
        <div>
          <div
            onClick={handleCategory}
            className="relative flex justify-between items-center gap-x-2 py-2 px-3 cursor-pointer hover:bg-gray-100 hover:rounded-full"
          >
            <FaBars />
            <p>Categories</p>
          </div>

          {isCategoriesOpen && (
            <ul className="absolute z-10 w-48 shadow-lg rounded-sm bg-white py-2">
              {categories.map((category) => (
                <li className="px-2 py-3 cursor-pointer hover:bg-gray-100">
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </div>
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
      <nav>
        <ul className="flex justify-between items-center space-x-4">
          {navLinks.map((link, index) => (
            <Link href={link.href} key={index}>
              <li
                className={`tracking-wide gap-x-2 py-2 px-3 hover:bg-gray-100 hover:rounded-full
                ${pathname.startsWith(link.href) && "underline"}
                `}
              >
                {link.name}
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </header>
  );
}
