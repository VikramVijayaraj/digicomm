import Link from "next/link";

import ProductCard from "../card/product-card";
import SectionLayout from "./section-layout";
import { getProducts } from "@/lib/db/products";
import { Button } from "../ui/button";

export const dynamic = "force-dynamic";

export default async function BestSelling() {
  let allProducts;

  try {
    allProducts = await getProducts();
  } catch (error) {
    console.error("Failed to fetch best-selling products:", error);

    return (
      <section className="global-padding text-center">
        <SectionLayout heading="Latest products">
          <h2 className="text-xl text-red-500 font-bold">
            Oops! Something went wrong.
          </h2>
          <p>We couldn't load the latest products. Please try again later.</p>
        </SectionLayout>
      </section>
    );
  }

  if (!allProducts || allProducts.length === 0) {
    return (
      <section className="global-padding">
        <SectionLayout heading="Latest products">
          <p>No products found at the moment.</p>
        </SectionLayout>
      </section>
    );
  }

  // Show only one product(latest one) per seller.
  // A Set to keep track of seller IDs we've already included.
  const uniqueSellerIds = new Set();

  const uniqueRecentProducts = allProducts
    // 1. Sort all products by date, so the newest ones come first.
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    // 2. Filter the sorted array.
    .filter((product) => {
      // Check if we've already seen this seller.
      if (!uniqueSellerIds.has(product.seller_id)) {
        // If not, add the seller's ID to our set...
        uniqueSellerIds.add(product.seller_id);
        // ...and keep this product.
        return true;
      }
      // If we have seen this seller, discard this product.
      return false;
    });

  // 3. Now, take the first 8 products from the unique list.
  const productsToShow = uniqueRecentProducts.slice(0, 8);

  const products = productsToShow.map((product) => (
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
      <SectionLayout heading="Latest products">
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
