import { getCategoryName } from "@/actions/db/categories";
import { getProductsByCategory } from "@/actions/db/products";
import ProductCard from "@/components/card/product-card";

export default async function CategoryProductsPage({ params }) {
  const { name: categoryName } = await getCategoryName(params.slug);

  const result = await getProductsByCategory(params.slug);

  const products = result.map((product) => (
    <li key={product.id}>
      <ProductCard
        imgUrl={product.images[0]}
        name={product.product_name}
        price={product.price}
        description={product.product_desc}
      />
    </li>
  ));

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">{categoryName}</h1>
      <ul className="grid grid-cols-4 p-14">{products}</ul>
    </div>
  );
}
