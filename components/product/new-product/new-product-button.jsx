"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NewProductButton() {
  const pathname = usePathname();

  return (
    <div>
      <Link href={`${pathname}/new-product`}>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </Link>
    </div>
  );
}
