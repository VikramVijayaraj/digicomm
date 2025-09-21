import Link from "next/link";
import { Plus } from "lucide-react";

import ProductCard from "@/components/card/product-card";
import SectionLayout from "../section/section-layout";
import { Button } from "../ui/button";

export default function ShopFeaturedProducts({ products }) {
  return (
    <div className="space-y-8">
      <SectionLayout heading="Featured Products">
        {products.length === 0 && (
          <div className="flex justify-center items-center gap-4">
            <Button asChild className="w-full md:w-fit text-white">
              <Link href={`/your/shop/dashboard/products/new-product`}>
                <Plus className="mr-2 h-4 w-4" />
                <p className="text-lg">New Product</p>
              </Link>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
          {products.map((product) => (
            <Link
              href={`/products/${product.product_slug}`}
              key={product.product_id}
            >
              <ProductCard
                imgUrl={product.images[0]}
                name={product.product_name}
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
