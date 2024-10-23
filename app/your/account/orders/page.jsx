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
import OrderActions from "@/components/user/order-actions";

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

              {/* Actions */}
              <TableCell>
                <OrderActions order={order} />
              </TableCell>
              {/* <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical className="stroke-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[5rem]">
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${order.product_slug}`}>View</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileDownloader
                        fileUrls={order.files} // Pass all file URLs
                        fileName={order.product_name}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Dialog>
                        <DialogTrigger>Request Refund</DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
