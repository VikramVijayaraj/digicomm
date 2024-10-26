import Link from "next/link";

import ProductCard from "@/components/card/product-card";
import SectionLayout from "@/components/section/section-layout";
import { getCategoryName } from "@/lib/db/categories";
import { getProductsByCategory } from "@/lib/db/products";

export default async function CategoryProductsPage({ params }) {
  try {
    const { name: categoryName } = await getCategoryName(params.slug);
    const products = await getProductsByCategory(params.slug);

    return (
      <div className="global-padding min-h-screen">
        <SectionLayout heading={categoryName}>
          {products.length === 0 ? (
            <p className="text-center mt-20">No products found in this category.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
              {products.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <ProductCard
                    imgUrl={product.images[0]}
                    name={product.product_name}
                    price={product.price}
                    category={product.category_name}
                  />
                </Link>
              ))}
            </div>
          )}
        </SectionLayout>
      </div>
    );
  } catch (error) {
    console.error("Error fetching category products:", error);
    return <div>Error loading products. Please try again later.</div>;
  }
}
