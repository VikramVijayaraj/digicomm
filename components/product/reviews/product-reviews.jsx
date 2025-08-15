import Link from "next/link";

import { Button } from "@/components/ui/button";
import UserReview from "./user-review";
import { getProductReviews } from "@/lib/db/reviews";

export default async function ProductReviews({ productId }) {
  const reviews = await getProductReviews(productId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center">
        <Button asChild variant="outline" className="w-full md:w-1/2 lg:w-1/3">
          <Link href={`/add-review?p=${productId}`}>Add a review</Link>
        </Button>
      </div>

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
