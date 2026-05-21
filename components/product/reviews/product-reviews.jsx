import Link from "next/link";

import { Button } from "@/components/ui/button";
import UserReview from "./user-review";
import { getProductReviews } from "@/lib/db/reviews";

export default async function ProductReviews({ productId }) {
  const reviews = await getProductReviews(productId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center">
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-full border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Link href={`/add-review?p=${productId}`}>Add a review</Link>
        </Button>
      </div>

      {reviews.length === 0 && (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
          No reviews yet
        </div>
      )}

      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id}>
            <UserReview
              rating={review.rating}
              postedDate={review.updated_at}
              comment={review.comment}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
