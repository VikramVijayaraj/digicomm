"use client";

import { useState } from "react";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";

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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileDownloader from "@/components/user/file-downloader";
import { toast } from "sonner";

export default function OrderActions({ order }) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="stroke-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[5rem]">
          <DropdownMenuItem asChild>
            <Link href={`/products/${order.product_slug}`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileDownloader
              fileUrls={order.files}
              fileName={order.product_name}
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setOpenDialog(true);
            }}
          >
            Request Refund
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              Once requested, the team will be notified and get back to you.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="outline"
              onClick={() => {
                // Handle refund request here
                setOpenDialog(false);
                toast.success("Refund request sent.");
              }}
            >
              Request Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
