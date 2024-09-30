import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getShopReviews } from "@/lib/db/reviews";
import UserReview from "./user-review";

export default async function ShopReviews({ sellerId }) {
  const reviews = await getShopReviews(sellerId);

  return (
    <div className="space-y-8">
      <Button asChild variant="outline" className="text-right w-full">
        <Link href={`/add-review?s=${sellerId}`}>Add a review</Link>
      </Button>

      {reviews.length === 0 && (
        <p className="text-center py-6">No reviews yet</p>
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
