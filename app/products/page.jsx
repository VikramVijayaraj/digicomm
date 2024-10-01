import Link from "next/link";

import ProductCard from "@/components/card/product-card";
import { getFilteredProducts } from "@/lib/db/products";
import BestSelling from "@/components/section/best-selling";
import SectionLayout from "@/components/section/section-layout";

export default async function FilteredProductsPage({ searchParams }) {
  const { query } = searchParams;
  const result = await getFilteredProducts(query);

  if (result.length === 0) {
    return (
      <div>
        <p className="text-center global-padding text-2xl">
          No product found! Try searching for other products.
        </p>

        <BestSelling />
      </div>
    );
  }

  const products = result.map((p) => (
    <Link href={"/products/" + p.product_slug} key={p.id}>
      <ProductCard
        imgUrl={p.image_url}
        name={p.product_name}
        price={p.price}
        category={p.category_name}
      />
    </Link>
  ));

  return (
    <div className="global-padding">
      <SectionLayout heading={`showing results for "${query}"`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
          {products}
        </div>
      </SectionLayout>
    </div>
  );
}
