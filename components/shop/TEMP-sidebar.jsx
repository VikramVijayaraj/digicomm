"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { shopSections } from "@/lib/data";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState(0);
  const pathname = usePathname();

  function handleActiveTab(index) {
    setActiveTab(index);
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1">
            <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
              {shopSections.map((section, index) => (
                <Link
                  key={index}
                  href={pathname + section.link}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground
                  transition-all hover:text-foreground ${ activeTab === index &&
                  "bg-muted text-foreground" }`}
                  onClick={() => handleActiveTab(index)}
                >
                  {section.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                {shopSections.map((section) => (
                  <Link
                    href=""
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground
                      hover:text-foreground"
                  >
                    {section.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
}
