import StarRating from "@/components/ui/star-rating";
import { dateConverter } from "@/utils/dateConverter";

export default function UserReview({ rating, postedDate, comment }) {
  const date = dateConverter(postedDate);

  return (
    <div className="space-y-2">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center">
        <StarRating rating={rating} disabled={true} />
        <p className="opacity-60">{date}</p>
      </div>
      <p className="line-clamp-2">{comment}</p>
    </div>
  );
}
