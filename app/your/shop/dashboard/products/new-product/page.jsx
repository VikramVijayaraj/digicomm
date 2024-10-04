import { auth } from "@/auth";
import { getCategories } from "@/lib/db/categories";
import ProductDetailsForm from "@/components/product/product-details-form";

export default async function NewProductPage() {
  const session = await auth();

  const categories = await getCategories();

  return (
    <div>
      <ProductDetailsForm session={session} categories={categories} />
    </div>
  );
}
