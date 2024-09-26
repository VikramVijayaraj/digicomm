import NewProductButton from "@/components/product/new-product/new-product-button";
import ShopProductsList from "@/components/shop/shop-products-list";

export default async function ShopProducts() {
  return (
    <div className="space-y-8">
      {/* Add Product Button */}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-3xl">Products</h1>
        <NewProductButton />
      </div>

      {/* Products List  */}
      <ShopProductsList />
    </div>
  );
}
