"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NewProductButton() {
  const pathname = usePathname();

  return (
    <div className="w-full md:w-auto">
      <Link href={`${pathname}/new-product`}>
        <Button className="h-12 w-full rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </Link>
    </div>
  );
}
