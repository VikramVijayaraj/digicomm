import Link from "next/link";
import { Eye } from "lucide-react";

import { auth } from "@/auth";
import { getOrders } from "@/lib/db/orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dateConverter } from "@/utils/dateConverter";
import { Button } from "@/components/ui/button";
import FileDownloader from "@/components/user/file-downloader";

export default async function OrdersPage() {
  const session = await auth();

  const orders = await getOrders(session?.user?.email);

  if (orders.length === 0) {
    return <p className="text-center">No orders found.</p>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Ordered At</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.order_item_id}>
              <TableCell>{order.product_name}</TableCell>
              <TableCell>{order.category_name}</TableCell>
              <TableCell>{dateConverter(order.order_placed_at)}</TableCell>
              <TableCell className="text-right">₹{order.price}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell className="text-right">
                ₹{(Number(order.price) * order.quantity).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button asChild variant="outline" size="icon">
                  <Link href={`/products/${order.product_slug}`}>
                    <Eye size={15} />
                  </Link>
                </Button>
              </TableCell>

              <TableCell>
                <FileDownloader
                  fileUrls={order.files} // Pass all file URLs
                  fileName={order.product_name}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
