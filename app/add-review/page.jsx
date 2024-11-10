import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AddReviewForm from "@/components/product/reviews/add-review-form";

export default async function AddReviewPage({ searchParams }) {
  const session = await auth();

  if (!session?.user) {
    // Construct the current URL with search params
    const currentPath = `/add-review?${new URLSearchParams(searchParams).toString()}`;
    // Encode the current path to use as the callback URL
    const encodedCallbackUrl = encodeURIComponent(currentPath);
    redirect(`/auth/signin?callbackUrl=${encodedCallbackUrl}`);
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
