import Link from "next/link";
import { revalidatePath } from "next/cache";

import ProductCard from "../card/product-card";
import SectionLayout from "./section-layout";
import { getProducts } from "@/lib/db/products";

export default async function BestSelling() {
  const result = await getProducts();
  revalidatePath("/");

  const products = result.map((product) => (
    <Link key={product.id} href={`/products/${product.product_slug}`}>
      <ProductCard
        name={product.product_name}
        price={product.price}
        category={product.category_name}
        imgUrl={product.image_url}
      />
    </Link>
  ));

  return (
    <section className="global-padding">
      <SectionLayout heading="Best Selling Products">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-8 gap-y-6">
          {products}
        </div>
      </SectionLayout>
    </section>
  );
}
