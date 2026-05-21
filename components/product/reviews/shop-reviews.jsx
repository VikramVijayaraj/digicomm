import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getShopReviews } from "@/lib/db/reviews";
import UserReview from "./user-review";

export default async function ShopReviews({ sellerId }) {
  const reviews = await getShopReviews(sellerId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center">
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-full border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Link href={`/add-review?s=${sellerId}`}>Add a review</Link>
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
