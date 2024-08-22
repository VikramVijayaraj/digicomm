"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSearch } from "react-icons/fa";

const navLinks = [
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
  { name: "Signup", href: "/signup" },
  { name: "Cart", href: "/cart" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex justify-between global-padding py-8 items-center">
      {/* Logo */}
      <Link href="/">
        <h1>{process.env.NEXT_PUBLIC_APP_NAME}</h1>
      </Link>

      {/* Search Icon */}
      <div className="flex justify-around px-4 py-2 items-center bg-gray-100">
        <input
          className="bg-gray-100"
          type="text"
          placeholder="Search for anything"
        />
        <FaSearch className="text-gray-500" />
      </div>

      {/* NavLinks */}
      <nav>
        <ul className="flex justify-between space-x-4">
          {navLinks.map((link, index) => (
            <Link href={link.href} key={index}>
              <li
                className={` text-gray-500 tracking-wide 
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
