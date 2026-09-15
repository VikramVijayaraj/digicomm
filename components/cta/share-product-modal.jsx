"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, IndianRupee, Sparkles } from "lucide-react";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import { getShareLinks } from "@/lib/share";
import { getStoragePath } from "@/utils/utils";

export default function ShareProductModal({ open, onOpenChange, product }) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_BASE_URL || "https://crelands.com";

  const productUrl = `${baseUrl}/products/${product.slug}`;
  const { instagram, twitter } = getShareLinks({
    productUrl,
    title: product.name,
  });

  const imagePath = getStoragePath(product.image);
  const fallbackImage = "/images/image-avatar.svg";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy product URL: ", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md rounded-[1.75rem] p-6 sm:p-7 border-slate-200"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onFocusOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-brand">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Product Published</span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
            Your product is live!
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Share your product with your audience to get your first views and sales.
          </DialogDescription>
        </DialogHeader>

        {/* Product Preview Card */}
        <div className="mt-4 flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image
              src={imagePath || fallbackImage}
              alt={product.name || "Product preview"}
              fill
              className="object-cover"
              unoptimized={!imagePath}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {product.name}
            </p>
            {product.price !== undefined && product.price !== null && (
              <p className="mt-0.5 flex items-center text-xs font-semibold text-slate-600">
                <IndianRupee className="mr-0.5 h-3 w-3 text-slate-500" />
                {product.price}
              </p>
            )}
            <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary-brand hover:underline"
            >
              <span>View live listing</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-4 flex flex-col gap-2.5">
          <Button
            asChild
            className="h-11 w-full rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] font-medium text-white shadow-sm transition-all hover:opacity-90"
          >
            <a
              href={instagram || "https://www.instagram.com/"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(productUrl);
                  toast.success("Link copied! Paste it in your Instagram story or bio.");
                } catch (err) {
                  // ignore
                }
              }}
              className="flex items-center justify-center gap-2"
            >
              <FaInstagram className="h-4 w-4" />
              <span>Share on Instagram</span>
            </a>
          </Button>

          <Button
            asChild
            className="h-11 w-full rounded-full bg-slate-950 font-medium text-white hover:bg-slate-800 shadow-sm transition-all"
          >
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <FaXTwitter className="h-4 w-4" />
              <span>Share on X</span>
            </a>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="h-11 w-full rounded-full border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Link copied to clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4 text-slate-500" />
                <span>Copy product link</span>
              </>
            )}
          </Button>
        </div>

        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors py-1"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
