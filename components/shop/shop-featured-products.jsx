import Link from "next/link";

import ProductCard from "@/components/card/product-card";
import SectionLayout from "../section/section-layout";

export default function ShopFeaturedProducts({ products }) {
  return (
    <div className="space-y-8">
      <SectionLayout heading="Featured Products">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
          {products.map((product) => (
            <Link
              href={`/products/${product.product_slug}`}
              key={product.product_id}
            >
              <ProductCard
                imgUrl={product.images[0]}
                name={product.name}
                category={product.category_name}
                price={product.price}
              />
            </Link>
          ))}
        </div>
      </SectionLayout>
    </div>
  );
}
