import NewProductButton from "@/components/product/new-product/new-product-button";
import ShopProductsList from "@/components/shop/shop-products-list";

export default async function ShopProducts() {
  return (
    <div className="space-y-8">
      {/* Add Product Button */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
          Products
        </h1>
        <NewProductButton />
      </div>

      {/* Products List  */}
      <ShopProductsList />
    </div>
  );
}
