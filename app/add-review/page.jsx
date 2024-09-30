import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AddReviewForm from "@/components/product/reviews/add-review-form";

export default async function AddReviewPage({ searchParams }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div>
      {searchParams?.p && (
        <AddReviewForm session={session} productId={searchParams.p} />
      )}
      {searchParams?.s && (
        <AddReviewForm session={session} sellerId={searchParams.s} />
      )}
    </div>
  );
}
