import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductReviews from "./product-reviews";
import ShopReviews from "./shop-reviews";

export default function Reviews({ productId, sellerId }) {
  return (
    <div>
      {/* Tabs */}
      <Tabs defaultValue="product">
        <TabsList className="w-full h-12 bg-white">
          <TabsTrigger
            className="w-1/2 h-full rounded-none data-[state=active]:shadow-none
              data-[state=active]:border-b data-[state=active]:border-primary"
            value="product"
          >
            Product Reviews
          </TabsTrigger>
          <TabsTrigger
            className="w-1/2 h-full rounded-none data-[state=active]:shadow-none
              data-[state=active]:border-b data-[state=active]:border-primary"
            value="shop"
          >
            Shop Reviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="product">
          <ProductReviews productId={productId} />
        </TabsContent>
        <TabsContent value="shop">
          <ShopReviews sellerId={sellerId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
