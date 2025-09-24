import { redirect } from "next/navigation";

import AddReviewForm from "@/components/product/reviews/add-review-form";
import { createClient } from "@/utils/supabase/server";

export default async function AddReviewPage({ searchParams }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    // Construct the current URL with search params
    const currentPath = `/add-review?${new URLSearchParams(searchParams).toString()}`;
    // Encode the current path to use as the callback URL
    const encodedCallbackUrl = encodeURIComponent(currentPath);
    redirect(`/auth/signin?callbackUrl=${encodedCallbackUrl}`);
  }

  return (
    <div>
      {searchParams?.p && (
        <AddReviewForm session={data} productId={searchParams.p} />
      )}
      {searchParams?.s && (
        <AddReviewForm session={data} sellerId={searchParams.s} />
      )}
    </div>
  );
}
