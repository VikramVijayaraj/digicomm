"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function NewProductButton() {
  const pathname = usePathname();

  return (
    <div>
      <Link href={`${pathname}/new-product`}>
        <Button className="w-full text-white">
          <Plus className="mr-2 h-4 w-4" />
          <p className="text-lg">New Product</p>
        </Button>
      </Link>
    </div>
    // <DropdownMenu className="w-full">
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant="outline"
    //       className="border-primary text-primary hover:bg-primary hover:text-white"
    //     >
    //       <Plus className="mr-2 h-4 w-4" />
    //       <p>New Product</p>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent>
    //     <Link asChild href={`${pathname}/new-product`}>
    //       <DropdownMenuItem className="cursor-pointer">
    //         Digital Product
    //       </DropdownMenuItem>
    //     </Link>
    //     <Link asChild href={`${pathname}/new-product?type=physical`}>
    //       <DropdownMenuItem className="cursor-pointer">
    //         Physical Product
    //       </DropdownMenuItem>
    //     </Link>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}
