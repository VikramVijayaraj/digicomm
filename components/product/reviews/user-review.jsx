"use client";

import { useState } from "react";

import StarRating from "@/components/ui/star-rating";

export default function UserReview(defaultRating = null) {
  const [rating, setRating] = useState(defaultRating);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <StarRating rating={rating} setRating={setRating} />
        <p className="opacity-60">2024-10-27T09:58:42.618Z</p>
      </div>
      <p>
        Minim amet est laborum sunt aute id minim enim exercitation deserunt
        cillum magna. Tempor ex ea quis aliquip eiusmod nisi mollit. Aliquip
        occaecat veniam non tempor velit elit eu deserunt pariatur. Voluptate
        quis dolor incididunt voluptate minim cillum duis enim anim ad eu
        aliqua.
      </p>
    </div>
  );
}
