"use client";

import { useState } from "react";
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileDownloader from "@/components/user/file-downloader";
import { sendRefundEmail } from "@/actions/send-email-action";

export default function OrderActions({ order, userEmail }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRequest() {
    setIsSubmitting(true);
    const formData = new FormData();

    const data = {
      orderItemId: order.order_item_id,
      email: userEmail,
    };

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await sendRefundEmail(formData);

    if (result.success) {
      toast.success("Request sent! We'll get back to you as soon as possible.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }

    setIsSubmitting(false);
    setOpenDialog(false);
  }

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
            <Button
              disabled={isSubmitting}
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              variant="outline"
              onClick={() => {
                handleRequest();
              }}
            >
              {isSubmitting ? "Sending..." : "Request Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
