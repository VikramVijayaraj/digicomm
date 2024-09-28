import Link from "next/link";

import { Button } from "@/components/ui/button";
import UserReview from "./user-review";

export default function ProductReviews({ productId }) {
  return (
    <div className="space-y-8">
      <Button asChild variant="outline" className="text-right w-full">
        <Link href={`/add-review?p=${productId}`}>Add a review</Link>
      </Button>

      <UserReview />
      <UserReview />
      <UserReview />
    </div>
  );
}
