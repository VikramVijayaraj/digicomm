import { IndianRupee } from "lucide-react";

import { auth } from "@/auth";
import { getShopProducts } from "@/lib/db/sellers";
import { dateConverter } from "@/utils/dateConverter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ShopProductActions from "./shop-product-actions";

export default async function ShopProductsList() {
  const session = await auth();

  const products = await getShopProducts(session?.user?.email);

  if (products.length === 0) {
    return <p className="text-center">No products are added.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          {/* <TableHead>Stock</TableHead> */}
          <TableHead>Price</TableHead>
          <TableHead>Modified At</TableHead>
          <TableHead className="w-4"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="hover:bg-none">
        {products.map((product) => (
          <TableRow key={product.product_id}>
            <TableCell>{product.product_name}</TableCell>
            <TableCell className="truncate">{product.category_name}</TableCell>
            {/* <TableCell>{product.stock}</TableCell> */}
            <TableCell>
              <p className="flex items-center">
                <IndianRupee size={15} />
                {product.price}
              </p>
            </TableCell>
            <TableCell>{dateConverter(product.updated_at)}</TableCell>

            {/* Actions */}
            <TableCell>
              <ShopProductActions product={product} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
