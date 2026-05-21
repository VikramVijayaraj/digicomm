import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductReviews from "./product-reviews";
import ShopReviews from "./shop-reviews";

export default function Reviews({ productId, sellerId }) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="product">
        <TabsList className="h-auto w-full rounded-full border border-slate-200 bg-slate-50 p-1">
          <TabsTrigger
            className="h-11 w-1/2 rounded-full text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
            value="product"
          >
            Product Reviews
          </TabsTrigger>
          <TabsTrigger
            className="h-11 w-1/2 rounded-full text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
            value="shop"
          >
            Shop Reviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="product" className="mt-6">
          <ProductReviews productId={productId} />
        </TabsContent>
        <TabsContent value="shop" className="mt-6">
          <ShopReviews sellerId={sellerId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
