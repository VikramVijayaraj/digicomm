import Image from "next/image";

import StarRating from "@/components/ui/star-rating";
import { getShopBySlug, getShopProducts } from "@/lib/db/sellers";
import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShopFeaturedProducts from "@/components/shop/shop-featured-products";
import ShopReviews from "@/components/product/reviews/shop-reviews";

export default async function ShopPage({ params }) {
  const session = await auth();

  const shop = await getShopBySlug(params.slug);
  const products = await getShopProducts(session?.user?.email);

  return (
    <div className="global-padding min-h-screen space-y-12">
      {/* Profile Card */}
      <div className="flex gap-8">
        <div>
          <div className="relative w-40 h-40">
            <Image
              className="object-cover"
              src={shop.shop_logo}
              alt={shop.shop_name}
              fill
            />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl">{shop.shop_name}</h3>
          <div>
            <StarRating rating={shop.rating} disabled={true} />
          </div>
          <p>{shop.shop_description}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="space-y-8">
        <TabsList className="w-full h-12 bg-white">
          <TabsTrigger
            className="w-1/2 h-full rounded-none data-[state=active]:shadow-none
              data-[state=active]:border-b data-[state=active]:border-primary"
            value="products"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            className="w-1/2 h-full rounded-none data-[state=active]:shadow-none
              data-[state=active]:border-b data-[state=active]:border-primary"
            value="reviews"
          >
            Reviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ShopFeaturedProducts products={products} />
        </TabsContent>
        <TabsContent value="reviews">
          <ShopReviews sellerId={shop.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
