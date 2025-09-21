import { getCategories } from "@/lib/db/categories";
import ProductDetailsForm from "@/components/product/product-details-form";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const categories = await getCategories();

  return (
    <div>
      <ProductDetailsForm session={data} categories={categories} />
    </div>
  );
}
