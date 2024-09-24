import NewListingForm from "@/components/product/new-listing/new-listing-form";
import { getCategories } from "@/lib/db/categories";

export default async function NewListingPage() {
  const categories = await getCategories();

  return (
    <div>
      <NewListingForm categories={categories} />
    </div>
  );
}
