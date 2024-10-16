"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ tabs }) {
  const pathname = usePathname();

  return (
    <div>
      <nav className="flex flex-row lg:flex-col lg:space-y-4 lg:px-4">
        {tabs.map((tab) => (
          <Link
            href={tab.link}
            className={`rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
            ${pathname === tab.link && "bg-muted text-primary rounded-md"}`}
            key={tab.name}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
