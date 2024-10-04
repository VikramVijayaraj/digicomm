import ProductDetailsForm from "@/components/product/product-details-form";
import { getCategories } from "@/lib/db/categories";
import { getProduct } from "@/lib/db/products";

export default async function EditProductPage({ searchParams }) {
  const product = await getProduct(searchParams.p);
  const categories = await getCategories();

  return (
    <div>
      <ProductDetailsForm categories={categories} productData={product} />
    </div>
  );
}
