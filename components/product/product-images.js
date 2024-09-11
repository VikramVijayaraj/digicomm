"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImages({ images }) {
  const [displayImage, setDisplayImage] = useState(images[0].image_url);

  const product_images = images.map((image) => (
    <div
      onClick={() => setDisplayImage(image.image_url)}
      key={image.image_id}
      className="relative w-24 h-24 mr-5 rounded-sm cursor-pointer"
    >
      <Image
        src={image.image_url}
        fill
        style={{ objectFit: "cover" }}
        alt={image.alt_text}
      />
    </div>
  ));

  return (
    <div className="relative w-2/3 h-[40rem] flex justify-start space-x-2">
      {/* Additional Images */}
      <div className="space-y-2 overflow-hidden no-scrollbar hover:overflow-auto hover:overflow-x-hidden">
        {product_images}
      </div>

      {/* Main Image */}
      <div className="relative w-full h-full">
        <Image
          src={displayImage}
          fill
          style={{ objectFit: "cover" }}
          alt="Banner Image"
        />
      </div>
    </div>
  );
}
