"use client";

import { useState, useOptimistic, useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  async function updateQuantity(newQuantity) {
    if (newQuantity > data.stock) {
      toast.error(`Sorry, only ${data.stock} items are available in stock.`);
      return;
    }

    startTransition(() => {
      setOptimisticQuantity(newQuantity);
      setQuantity(newQuantity);
      updateCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === data.product_id
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    });

    try {
      await updateCartItemQuantityAction(
        data.cart_id,
        data.product_id,
        newQuantity,
      );
    } catch (error) {
      toast.error("Failed to update quantity. Please try again.");
      startTransition(() => {
        setOptimisticQuantity(quantity);
        setQuantity(quantity);
        updateCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product_id === data.product_id
              ? { ...item, quantity: quantity }
              : item,
          ),
        );
      });
    }
  }

  function incrementQuantity() {
    updateQuantity(optimisticQuantity + 1);
    // const newQuantity = optimisticQuantity + 1;
    // if (newQuantity <= data.stock) {
    //   updateQuantity(newQuantity);
    // } else {
    //   toast.error(`Sorry, only ${data.stock} items are available in stock.`);
    // }
  }

  function decrementQuantity() {
    if (optimisticQuantity > 1) {
      updateQuantity(optimisticQuantity - 1);
    }
  }

  async function handleDelete() {
    startTransition(() => {
      updateCartItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== data.product_id),
      );
    });

    try {
      await removeFromCartAction(data.cart_id, data.product_id);
      toast.success("Item removed from cart");
    } catch (error) {
      startTransition(() => {
        updateCartItems((prevItems) => [...prevItems, data]);
      });
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
