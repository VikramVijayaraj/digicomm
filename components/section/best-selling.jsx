import Link from "next/link";
import { revalidatePath } from "next/cache";

import ProductCard from "../card/product-card";
import SectionLayout from "./section-layout";
import { getProducts } from "@/lib/db/products";
import { Button } from "../ui/button";

export default async function BestSelling() {
  const allProducts = await getProducts();
  const recentProducts = allProducts
    .sort((a, b) => b.updated_at - a.updated_at)
    .slice(0, 8);

  const products = recentProducts.map((product) => (
    <Link key={product.id} href={`/products/${product.product_slug}`}>
      <ProductCard
        name={product.product_name}
        price={product.price}
        category={product.category_name}
        imgUrl={product.image_url}
      />
    </Link>
  ));

  revalidatePath("/");

  return (
    <section className="global-padding">
      <SectionLayout heading="Featured products">
        <div
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-8
            gap-y-6"
        >
          {products}
        </div>
      </SectionLayout>

      <div className="flex items-center justify-center mt-8 md:mt-12">
        <Button
          asChild
          variant="outline"
          className="w-full md:w-1/3 py-4 text-black border border-black hover:text-white
            hover:bg-black"
        >
          <Link href="/products">View All</Link>
        </Button>
      </div>
    </section>
  );
}
