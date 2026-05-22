"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
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
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-950"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 rounded-2xl border-slate-200 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
      >
        <DropdownMenuItem asChild className="rounded-xl">
          <Link href={`/products/${product.product_slug}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl">
          <Link
            href={`/your/shop/dashboard/products/edit-product?p=${product.product_slug}`}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteDialog product={product} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const DeleteDialog = React.forwardRef(({ product }, ref) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await deleteProductAction(product);
      toast.success("Product Deleted Successfully!");
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to delete product.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          ref={ref}
          type="button"
          className="flex w-full cursor-pointer items-center rounded-xl px-2 py-1.5 text-left text-sm text-red-600 outline-none transition-colors hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-[1.75rem] border-slate-200 p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-950">
            Delete product?
          </DialogTitle>
          <DialogDescription className="leading-6 text-slate-600">
            This will permanently delete{" "}
            <span className="font-semibold">{product.product_name}</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isDeleting}
              className="h-11 rounded-full border-slate-200 px-5"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeleting}
            className="h-11 rounded-full px-5"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

// Required to add a displayName for the forwardRef component for debugging
DeleteDialog.displayName = "DeleteDialog";
