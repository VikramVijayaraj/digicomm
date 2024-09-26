import { getCategories } from "@/lib/db/categories";
import NewProductForm from "@/components/product/new-product/new-product-form";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <NewProductForm session={session} categories={categories} />
    </div>
  );
}
