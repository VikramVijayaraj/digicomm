import { IndianRupee } from "lucide-react";

import { getShopProducts } from "@/lib/db/sellers";
import { dateConverter } from "@/utils/dateConverter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ShopProductActions from "./shop-product-actions";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { getStoragePath } from "@/utils/utils";

export default async function ShopProductsList() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const products = await getShopProducts(data?.user?.email);

  if (products.length === 0) {
    return <p className="text-center">No products are added.</p>;
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const imagePath = getStoragePath(
          product.images.length > 0 && product.images[0],
        );
        return (
          <Card key={product.product_id}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-4">
                  <Image
                    src={imagePath}
                    width="100"
                    height="100"
                    className="rounded-lg object-cover"
                    alt={product.product_name}
                  />
                  <div>
                    <CardTitle className="text-lg">
                      <Link
                        href={`/products/${product.product_slug}`}
                        className="hover:underline"
                      >
                        {product.product_name}
                      </Link>
                    </CardTitle>
                    <CardDescription>{product.category_name}</CardDescription>
                  </div>
                </div>
                <div>
                  <ShopProductActions product={product} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-gray-500">
                {dateConverter(product.updated_at)}
              </p>
              <p className="flex items-center text-green-600 font-semibold">
                <IndianRupee size={15} />
                {product.price}
              </p>
            </CardContent>
            {/* <CardFooter></CardFooter> */}
          </Card>
        );
      })}
    </div>
  );
}
