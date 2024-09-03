"use client";

import Link from "next/link";
import { useState } from "react";

import { logout } from "@/actions/auth-actions";

export default function Dropdown({ children, data }) {
  const [isOpen, SetIsOpen] = useState(false);

  function toggleDropdown() {
    SetIsOpen(!isOpen);
  }

  function handleMenuOption(option) {
    if (option === "Logout") {
      logout();
    }
  }

  return (
    <div>
      <div
        onClick={toggleDropdown}
        className="relative flex justify-between items-center gap-x-2 py-2 px-3 cursor-pointer hover:bg-gray-100 hover:rounded-full"
      >
        {children}
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-48 shadow-lg rounded-sm bg-white py-2">
          {data.map((d, index) => (
            <li
              key={index}
              onClick={handleMenuOption.bind(null, d.name)}
              className="px-2 py-3 cursor-pointer hover:bg-gray-100"
              name={d.name}
            >
              <Link href={d.link}>{d.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
