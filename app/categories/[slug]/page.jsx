import ProductCard from "@/components/card/product-card";
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
        description={product.product_desc}
      />
    </Link>
  ));

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">{categoryName}</h1>
      <div className="grid grid-cols-4 p-14">{products}</div>
    </div>
  );
}
