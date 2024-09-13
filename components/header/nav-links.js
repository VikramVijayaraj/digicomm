"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsCart4 } from "react-icons/bs";

import UserImage from "./user-image";
import Dropdown from "./dropdown";
import { loggedUserOptions } from "@/lib/data";

export default function NavLinks({ session }) {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex justify-between items-center space-x-4">
        <li
          className={`tracking-wide gap-x-2 py-2 px-3 hover:bg-gray-100 hover:rounded-full
                ${pathname.startsWith("/signin") && "bg-gray-100 rounded-full"}
                `}
        >
          {session?.user ? (
            <Dropdown data={loggedUserOptions}>
              <UserImage className="text-xl" img={session?.user?.image} />
            </Dropdown>
          ) : (
            <Link href="/signin">Sign in</Link>
          )}
        </li>

        <li
          className={`tracking-wide gap-x-2 py-2 px-3 hover:bg-gray-100 hover:rounded-full
                ${pathname.startsWith("/cart") && "bg-gray-100 rounded-full"}
                `}
        >
          <Link href="/cart">
            <BsCart4 className="text-2xl" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
