"use client";

import { useOptimistic, useTransition } from "react";

import CartItem from "@/components/cart/cart-item";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OptimisticCart({ initialCartItems }) {
  const [optimisticCartItems, updateOptimisticCartItems] =
    useOptimistic(initialCartItems);
  const [isPending, startTransition] = useTransition();

  const updateCartItems = (updateFn) => {
    startTransition(() => {
      updateOptimisticCartItems(updateFn);
    });
  };

  if (optimisticCartItems.length === 0) {
    return <p className="text-center min-h-screen">Cart is empty!</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {optimisticCartItems.map((item) => (
          <TableRow key={item.product_id}>
            <CartItem data={item} updateCartItems={updateCartItems} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
