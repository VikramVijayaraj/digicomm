import Link from "next/link";

import ProductCard from "@/components/card/product-card";

export default function ShopFeaturedProducts({ products }) {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl">Featured Products</h3>

      <div className="grid grid-cols-5 gap-x-4 gap-y-6">
        {products.map((product) => (
          <Link href={`/products/${product.slug}`} key={product.id}>
            <ProductCard
              imgUrl={product.images[0]}
              name={product.name}
              description={product.description}
              price={product.price}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
