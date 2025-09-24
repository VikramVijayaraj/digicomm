import { getSellerOrders } from "@/lib/db/sellers";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrdersListContainer from "@/components/ui/orders-list-container";
import { createClient } from "@/utils/supabase/server";

export default async function ShopOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const shopOrders = await getSellerOrders(data?.user?.email);

  if (shopOrders.length === 0) {
    return <p className="text-center mt-10">No orders found.</p>;
  }

  return (
    <>
      <OrdersListContainer orderData={shopOrders} />

      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Ordered At</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shopOrders.map((order) => (
            <TableRow key={order.product_name}>
              <TableCell>{order.order_id}</TableCell>
              <TableCell>{order.product_name}</TableCell>
              <TableCell>{dateConverter(order.order_date)}</TableCell>
              <TableCell className="text-right">₹{order.price}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell className="text-right">
                ₹{(Number(order.price) * order.quantity).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Order Total</TableCell>
          <TableCell className="text-right">
            ₹{shopOrders[0].total_amount}
          </TableCell>
        </TableRow>
      </TableFooter>
      </Table> */}
    </>
  );
}
