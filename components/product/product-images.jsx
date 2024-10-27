"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function ProductImages({ images, alt_texts }) {
  const [displayImage, setDisplayImage] = useState(images[0]);
  const [isOpen, setIsOpen] = useState(false);

  const product_images = images.map((image, index) => (
    <div
      onClick={() => setDisplayImage(image)}
      key={image}
      className="relative w-24 h-24 mr-5 rounded-sm cursor-pointer"
    >
      <Image
        src={image}
        fill
        style={{ objectFit: "cover" }}
        alt={alt_texts[index] || "Product Image"}
      />
    </div>
  ));

  return (
    <div className="relative w-full lg:w-2/3 h-[20rem] md:h-[30rem] flex justify-start space-x-2">
      {/* Additional Images */}
      <div
        className="space-y-2 overflow-hidden no-scrollbar hover:overflow-auto
          hover:overflow-x-hidden"
      >
        {product_images}
      </div>

      {/* Display Image */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative w-full h-full cursor-zoom-in">
            <Image
              src={displayImage}
              fill
              style={{ objectFit: "cover" }}
              alt="Display Image"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[60vw] max-h-[90vh] p-0 text-white bg-black border-none">
          <div className="relative w-full h-[90vh]">
            <Image
              src={displayImage}
              fill
              style={{ objectFit: "contain" }}
              alt="Full Size Image"
            />
            {/* <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white
                hover:bg-opacity-75 transition-opacity"
            >
              <X size={24} />
            </button> */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
