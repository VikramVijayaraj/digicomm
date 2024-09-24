"use client";

import { shopTabs } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ShopSidebar() {
  const pathname = usePathname();

  return (
    <div>
      <nav className="flex flex-col space-y-4 lg:px-4">
        {shopTabs.map((tab) => (
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
