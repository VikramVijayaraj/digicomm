import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function AvgRatingContainer({ avgRating, totalReviews }) {
  return (
    <div className="flex items-center gap-2">
      <Badge className="gap-1">
        {avgRating} <Star size={12} fill="white" />
        {/* </p> */}
      </Badge>
      <p className="text-sm">{totalReviews} Reviews</p>
    </div>
  );
}
