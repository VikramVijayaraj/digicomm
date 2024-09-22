"use client";

import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

export default function AddToFavourites() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex justify-center items-center w-10 border border-gray-400 cursor-pointer rounded-sm hover:fill-primary"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered ? (
        <FaHeart className="text-red-500 transition-colors duration-300 text-xl" />
      ) : (
        <FaRegHeart className="text-gray-500 transition-colors duration-300 text-xl" />
      )}
    </div>
  );
}
