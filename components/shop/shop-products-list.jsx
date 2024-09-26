import { auth } from "@/auth";
import { getShopProducts } from "@/lib/db/sellers";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dateConverter } from "@/utils/dateConverter";

export default async function ShopProductsList() {
  const session = await auth();

  const products = await getShopProducts(session?.user?.email);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Modified At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell className="truncate">{product.description}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell>{dateConverter(product.updated_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
