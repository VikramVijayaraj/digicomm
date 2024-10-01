"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImages({ images, alt_texts }) {
  const [displayImage, setDisplayImage] = useState(images[0]);

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
    <div className="relative w-full lg:w-2/3 h-[30rem] flex justify-start space-x-2">
      {/* Additional Images */}
      <div
        className="space-y-2 overflow-hidden no-scrollbar hover:overflow-auto
          hover:overflow-x-hidden"
      >
        {product_images}
      </div>

      {/* Display Image */}
      <div className="relative w-full h-full">
        <Image
          src={displayImage}
          fill
          style={{ objectFit: "cover" }}
          alt="Display Image"
        />
      </div>
    </div>
  );
}
