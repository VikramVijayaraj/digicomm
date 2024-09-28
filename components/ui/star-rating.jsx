"use client";

import { Star } from "lucide-react";
import { useState } from "react";

export default function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex">
      {[...Array(5)].map((star, index) => {
        const currentRating = index + 1;
        return (
          <label key={index}>
            <input
              className="hidden"
              type="radio"
              name="rating"
              value={currentRating}
              onClick={() => setRating(currentRating)}
            />
            <Star
              className="cursor-pointer"
              stroke={
                currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"
              }
              fill={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
}
