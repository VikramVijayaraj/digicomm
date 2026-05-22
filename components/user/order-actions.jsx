"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, EllipsisVertical, Eye, RefreshCcw } from "lucide-react";
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
import { getSellerDetailsAction } from "@/actions/seller-actions";

export default function OrderActions({ order, userEmail }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRequest() {
    setIsSubmitting(true);
    const formData = new FormData();
    const sellerDetails = await getSellerDetailsAction(order.order_item_id);
    const data = {
      buyerEmail: userEmail,
      sellerEmail: sellerDetails.email,
      orderItemId: order.order_item_id,
      sellerFirstName: sellerDetails.first_name,
      productName: order.product_name,
      quantity: order.quantity,
      price: order.price,
      orderPlacedAt: order.order_placed_at,
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
          className="w-48 rounded-2xl border-slate-200 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
        >
          <DropdownMenuItem asChild className="rounded-xl">
            <Link href={`/products/${order.product_slug}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl">
            <Download className="mr-2 h-4 w-4" />
            <FileDownloader
              fileUrls={order.files}
              fileName={order.product_name}
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="rounded-xl text-red-600 focus:bg-red-50 focus:text-red-700"
            onSelect={(event) => {
              event.preventDefault();
              setOpenDialog(true);
            }}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Request Refund
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="rounded-[1.75rem] border-slate-200 p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-950">
              Request refund?
            </DialogTitle>
            <DialogDescription className="leading-6 text-slate-600">
              Once requested, the team will be notified and get back to you.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isSubmitting}
              onClick={() => setOpenDialog(false)}
              variant="outline"
              className="h-11 rounded-full border-slate-200 px-5"
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              variant="destructive"
              className="h-11 rounded-full px-5"
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
