import Link from "next/link";

import ProductCard from "@/components/card/product-card";
import { getFilteredProducts, getProducts } from "@/lib/db/products";
import BestSelling from "@/components/section/best-selling";
import SectionLayout from "@/components/section/section-layout";

export default async function FilteredProductsPage({ searchParams }) {
  const { query } = searchParams;
  let result;

  if (query) {
    result = await getFilteredProducts(query);
  } else {
    result = await getProducts();
  }

  if (result.length === 0) {
    return (
      <div className="space-y-20 lg:space-y-36">
        <p className="mt-20 text-center lg:text-2xl">
          No product found! Try searching for other products.
        </p>
        <BestSelling />
      </div>
    );
  }

  return (
    <div className="global-padding">
      <SectionLayout
        heading={query ? `Showing results for "${query}"` : "Explore Products"}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {result.map((p) => (
            <Link href={"/products/" + p.product_slug} key={p.id}>
              <ProductCard
                imgUrl={p.image_url}
                name={p.product_name}
                price={p.price}
                category={p.category_name}
              />
            </Link>
          ))}
        </div>
      </SectionLayout>
    </div>
  );
}
