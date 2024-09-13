"use client";

import Link from "next/link";
import { useState } from "react";

import { signOut } from "next-auth/react";

export default function Dropdown({ children, data, parent = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleMenuOption(option) {
    if (option === "Logout") {
      signOut();
    }
  }

  return (
    <div
      onMouseOver={() => setIsOpen(true)}
      onMouseOut={() => setIsOpen(false)}
    >
      <div className="relative flex justify-between items-center gap-x-2 py-2 px-3 cursor-pointer hover:bg-gray-100 hover:rounded-full">
        {children}
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-48 shadow-lg rounded-sm bg-white py-2">
          {data.map((d) => (
            <Link href={parent ? parent + d.slug : d.slug}>
              <li
                key={d.id}
                onClick={handleMenuOption.bind(null, d.name)}
                className="px-2 py-3 cursor-pointer hover:bg-gray-100"
                name={d.name}
              >
                {d.name}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
