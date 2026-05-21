"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getStoragePath } from "@/utils/utils";

export default function ProductImages({ images, alt_texts }) {
  const [displayImage, setDisplayImage] = useState(getStoragePath(images?.[0]));
  const [isOpen, setIsOpen] = useState(false);

  // If the 'images' prop changes (e.g. user navigates to new product), update the display image.
  useEffect(() => {
    if (images && images.length > 0) {
      setDisplayImage(getStoragePath(images[0]));
    }
  }, [images]);

  if (!images || images.length === 0) return null;

  const product_images = images.map((image, index) => {
    const imagePath = getStoragePath(image);
    const isActive = displayImage === imagePath;
    return (
      <div
        onClick={() => setDisplayImage(imagePath)}
        key={image}
        className={`relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-[1rem] border bg-white transition sm:h-24 sm:w-24 ${
          isActive
            ? "border-primary-brand shadow-[0_10px_25px_rgba(251,32,26,0.12)]"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <Image
          src={imagePath}
          fill
          style={{ objectFit: "cover" }}
          alt={alt_texts[index] || "Product Image"}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    );
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[96px_minmax(0,1fr)] lg:items-start">
      <div className="order-2 flex gap-3 overflow-x-auto pb-1 no-scrollbar lg:order-1 lg:max-h-[38rem] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
        {product_images}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative order-1 h-[22rem] w-full cursor-zoom-in overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:h-[28rem] lg:order-2 lg:h-[38rem]">
            <Image
              src={displayImage}
              fill
              style={{ objectFit: "contain" }}
              alt="Display Image"
              onContextMenu={(e) => e.preventDefault()}
              className="p-4 sm:p-6"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-[92vw] border-none bg-black p-0 text-white lg:max-w-[70vw]">
          <div className="relative w-full h-[90vh]">
            <Image
              src={displayImage}
              fill
              style={{ objectFit: "contain" }}
              alt="Full Size Image"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
