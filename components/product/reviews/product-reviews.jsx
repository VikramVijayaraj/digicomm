import Link from "next/link";

import { Button } from "@/components/ui/button";
import UserReview from "./user-review";
import { getProductReviews } from "@/lib/db/reviews";

export default async function ProductReviews({ productId }) {
  const reviews = await getProductReviews(productId);

  return (
    <div className="space-y-8">
      <Button asChild variant="outline" className="text-right w-full">
        <Link href={`/add-review?p=${productId}`}>Add a review</Link>
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
