"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  Package2,
  ShoppingBag,
} from "lucide-react";

const tabIcons = {
  Dashboard: LayoutDashboard,
  Products: Package2,
  Orders: ShoppingBag,
  Payment: CreditCard,
};

export default function Sidebar({ tabs }) {
  const pathname = usePathname();

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.05)] lg:sticky lg:top-24 lg:p-4">
      <div className="mb-3 hidden px-2 lg:block">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
          Seller Workspace
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab.name] || LayoutDashboard;
          const isActive =
            pathname === tab.link ||
            (tab.link !== "/your/shop/dashboard" &&
              pathname.startsWith(tab.link));

          return (
            <Link
              href={tab.link}
              className={`inline-flex min-w-fit items-center gap-3 rounded-[1rem] px-4 py-3 text-sm font-medium transition-all lg:w-full ${
                isActive
                  ? "bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_100%)] text-slate-950 shadow-sm ring-1 ring-orange-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
              key={tab.name}
            >
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${
                  isActive
                    ? "bg-orange-50 text-primary-brand"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
