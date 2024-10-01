import ProductCard from "@/components/card/product-card";
import SectionLayout from "@/components/section/section-layout";
import { getCategoryName } from "@/lib/db/categories";
import { getProductsByCategory } from "@/lib/db/products";
import Link from "next/link";

export default async function CategoryProductsPage({ params }) {
  const { name: categoryName } = await getCategoryName(params.slug);

  const result = await getProductsByCategory(params.slug);

  const products = result.map((product) => (
    <Link href={"/products/" + product.slug} key={product.id}>
      <ProductCard
        imgUrl={product.images[0]}
        name={product.product_name}
        price={product.price}
        category={product.category_name}
      />
    </Link>
  ));

  return (
    <div className="global-padding">
      <SectionLayout heading={categoryName}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
          {products}
        </div>
      </SectionLayout>
    </div>
  );
}
