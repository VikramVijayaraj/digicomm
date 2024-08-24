import Link from "next/link";

import ProductCard from "../card/product-card";
import SectionLayout from "./section-layout";

export default function BestSelling() {
  return (
    <section className="global-padding">
      <SectionLayout heading="Best Selling Products">
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          <Link href="/product/macbook-pro">
            <ProductCard />
          </Link>
          <Link href="/product/macbook-pro">
            <ProductCard />
          </Link>
          <Link href="/product/macbook-pro">
            <ProductCard />
          </Link>
          <Link href="/product/macbook-pro">
            <ProductCard />
          </Link>
        </div>
      </SectionLayout>
    </section>
  );
}
