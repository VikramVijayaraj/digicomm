import StarRating from "@/components/ui/star-rating";
import { dateConverter } from "@/utils/dateConverter";

export default function UserReview({ rating, postedDate, comment }) {
  const date = dateConverter(postedDate);

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <StarRating rating={rating} disabled={true} />
        <p className="text-sm text-slate-500">{date}</p>
      </div>
      <p className="mt-4 leading-7 text-slate-700">{comment}</p>
    </div>
  );
}
