import { Star } from "lucide-react";

export default function AvgRatingContainer({ avgRating, totalReviews }) {
  return (
    <div className="flex items-center gap-2">
      <p
        className="flex items-center gap-1 bg-green-700 rounded-md w-fit py-1 px-2 text-sm
          text-white"
      >
        {avgRating} <Star size={15} fill="white" />
      </p>
      <p>{totalReviews} Reviews</p>
    </div>
  );
}
