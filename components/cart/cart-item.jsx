"use client";

import { useState, useOptimistic, useTransition } from "react";
import { IndianRupee, Trash2 } from "lucide-react";
import { toast } from "sonner";

import Quantity from "../product/quantity";
import {
  removeFromCartAction,
  removeFromGuestCartAction,
  updateCartItemQuantityAction,
  updateGuestCartItemAction,
} from "@/actions/cart-action";
import { Button } from "../ui/button";

export default function CartItem({ data, updateCartItems }) {
  const [quantity, setQuantity] = useState(data.quantity);
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(quantity);
  const [isPending, startTransition] = useTransition();

  async function updateQuantity(newQuantity) {
    // if (newQuantity > data.stock) {
    //   toast.error(`Sorry, only ${data.stock} items are available in stock.`);
    //   return;
    // }

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
      if (data.cart_id) {
        await updateCartItemQuantityAction(
          data.cart_id,
          data.product_id,
          newQuantity,
        );
      } else {
        await updateGuestCartItemAction(data.product_id, newQuantity);
      }
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
      if (data.cart_id) {
        await removeFromCartAction(data.cart_id, data.product_id);
      } else {
        await removeFromGuestCartAction(data.product_id);
      }

      toast.success("Item removed from cart");
    } catch (error) {
      startTransition(() => {
        updateCartItems((prevItems) => [...prevItems, data]);
      });
      toast.error("Failed to remove item from cart. Please try again.");
    }
  }

  return (
    <div className="grid gap-4 px-4 py-5 transition-colors hover:bg-slate-50/70 sm:px-5 lg:grid-cols-[minmax(0,1fr)_130px_180px_130px_48px] lg:items-center">
      <div className="min-w-0">
        <p className="line-clamp-2 text-base font-semibold leading-6 text-slate-950">
          {data.name}
        </p>
        {data.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
            {data.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 lg:block">
        <span className="text-sm font-medium text-slate-500 lg:hidden">
          Price
        </span>
        <p className="flex items-center font-semibold text-slate-950">
          <IndianRupee className="mr-1 h-4 w-4" />
          {data.price}
        </p>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-500 lg:hidden">
          Quantity
        </span>
        <div className="max-w-44">
          <Quantity
            quantity={optimisticQuantity}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 lg:justify-end">
        <span className="text-sm font-medium text-slate-500 lg:hidden">
          Total
        </span>
        <p className="flex items-center font-semibold text-slate-950">
          <IndianRupee className="mr-1 h-4 w-4" />
          {(data.price * optimisticQuantity).toFixed(2)}
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isPending}
          onClick={handleDelete}
          className="h-10 w-10 rounded-full border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
