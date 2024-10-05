"use client";

import { useState, useOptimistic } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import Quantity from "../product/quantity";
import {
  removeFromCartAction,
  updateCartItemQuantityAction,
} from "@/actions/cart-action";
import { TableCell } from "../ui/table";

export default function CartItem({ data, updateCartItems }) {
  const [quantity, setQuantity] = useState(data.quantity);

  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(quantity);

  async function updateQuantity(newQuantity) {
    setOptimisticQuantity(newQuantity);
    setQuantity(newQuantity);

    try {
      await updateCartItemQuantityAction(data.product_id, newQuantity);
      updateCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === data.product_id
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    } catch (error) {
      toast.error("Failed to update quantity. Please try again.");
      setOptimisticQuantity(quantity);
      setQuantity(quantity);
    }
  }

  function incrementQuantity() {
    updateQuantity(optimisticQuantity + 1);
  }

  function decrementQuantity() {
    if (optimisticQuantity > 1) {
      updateQuantity(optimisticQuantity - 1);
    }
  }

  async function handleDelete() {
    updateCartItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== data.product_id),
    );

    try {
      await removeFromCartAction(data.product_id);
      toast.success("Item removed from cart");
    } catch (error) {
      updateCartItems((prevItems) => [...prevItems, data]);
      toast.error("Failed to remove item from cart. Please try again.");
    }
  }

  return (
    <>
      <TableCell>{data.name}</TableCell>
      <TableCell>₹{data.price}</TableCell>
      <TableCell>
        <div className="w-32 h-12 m-auto">
          <Quantity
            quantity={optimisticQuantity}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
        </div>
      </TableCell>
      <TableCell className="text-right font-semibold">
        ₹{(data.price * optimisticQuantity).toFixed(2)}
      </TableCell>

      <TableCell>
        <X className="text-red-500 cursor-pointer" onClick={handleDelete} />
      </TableCell>
    </>
  );
}
