"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { deleteProductAction } from "@/actions/product-actions";

export default function ShopProductActions({ product }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="stroke-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[5rem]">
        <DropdownMenuItem asChild>
          <Link href={`/products/${product.product_slug}`}>View</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/your/shop/dashboard/products/edit-product?p=${product.product_slug}`}
          >
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteDialog product={product} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const DeleteDialog = React.forwardRef(({ product }, ref) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await deleteProductAction(product);
    toast.info("Product Deleted Successfully!");
    router.refresh();
    setIsDeleting(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p ref={ref} className="text-red-700 px-2 cursor-pointer">
          Delete
        </p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete product?</DialogTitle>
          <DialogDescription>
            This will delete{" "}
            <span className="font-semibold">{product.product_name}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {!isDeleting && (
            <DialogClose asChild>
              <Button>No</Button>
            </DialogClose>
          )}

          {!isDeleting && (
            <Button onClick={handleDelete} variant="secondary">
              Yes
            </Button>
          )}

          {isDeleting && <p className="text-center">Deleting...</p>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

// Required to add a displayName for the forwardRef component for debugging
DeleteDialog.displayName = "DeleteDialog";
