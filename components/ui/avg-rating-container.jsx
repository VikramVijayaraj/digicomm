import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function AvgRatingContainer({ avgRating, totalReviews }) {
  return (
    <div className="flex items-center gap-3">
      <Badge className="gap-1 rounded-full bg-slate-950 px-3 py-1 text-white">
        {avgRating || "0.0"} <Star size={12} fill="white" />
      </Badge>
      <p className="text-sm font-medium text-slate-600">
        {totalReviews || 0} reviews
      </p>
    </div>
  );
}
