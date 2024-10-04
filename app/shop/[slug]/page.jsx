import Image from "next/image";

import { getShopBySlug, getShopProductsBySlug } from "@/lib/db/sellers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShopFeaturedProducts from "@/components/shop/shop-featured-products";
import ShopReviews from "@/components/product/reviews/shop-reviews";
import { getAvgShopRating } from "@/lib/db/reviews";
import AvgRatingContainer from "@/components/ui/avg-rating-container";

export default async function ShopPage({ params }) {
  const { slug } = params;

  const shop = await getShopBySlug(slug);
  const products = await getShopProductsBySlug(slug);
  const rating = await getAvgShopRating(slug);

  return (
    <div className="global-padding min-h-screen space-y-8 md:space-y-10 lg:space-y-12">
      {/* Profile Card */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="m-auto md:m-0">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              className="object-cover"
              src={shop?.shop_logo}
              alt={shop.shop_name}
              fill
            />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl">{shop.shop_name}</h3>

          <AvgRatingContainer
            avgRating={rating.avg_rating}
            totalReviews={rating.total_reviews}
          />

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
