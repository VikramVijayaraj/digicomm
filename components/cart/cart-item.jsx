"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";

import Quantity from "../product/quantity";
import { RemoveFromCartAction } from "@/actions/cart-action";
import { addToTotal, removeFromTotal } from "@/store/slices/cartSlice";
import { TableCell } from "../ui/table";
import { toast } from "sonner";

export default function CartItem({ data }) {
  const [quantity, setQuantity] = useState(data.quantity);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      addToTotal({
        productId: data.product_id,
        totalPrice: data.price * quantity,
      }),
    );
  }, [quantity, data.price, data.product_id, dispatch]);

  function incrementQuantity() {
    setQuantity((q) => q + 1);
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  }

  async function handleDelete() {
    await RemoveFromCartAction(data.product_id);
    dispatch(removeFromTotal({ productId: data.product_id }));
    toast.info("Item removed from cart");
  }

  return (
    <>
      <TableCell>{data.name}</TableCell>
      <TableCell>${data.price}</TableCell>
      <TableCell>
        <div className="w-32 h-12 m-auto">
          <Quantity
            quantity={quantity}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
        </div>
      </TableCell>
      <TableCell className="text-right font-semibold">
        ${(data.price * quantity).toFixed(2)}
      </TableCell>

      <TableCell>
        <X className="text-red-500 cursor-pointer" onClick={handleDelete} />
      </TableCell>
    </>
  );
}
