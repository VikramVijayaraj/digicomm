"use client";

import { FaTrash } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Quantity from "../product/quantity";
import TableData from "./table-data";
import { RemoveFromCartAction } from "@/actions/cart-action";
import { addToTotal } from "@/store/slices/cartSlice";

export default function CartItem({ data }) {
  const [quantity, setQuantity] = useState(data.quantity);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      addToTotal({
        productId: data.product_id,
        totalPrice: data.price * quantity,
      })
    );
  }, [quantity]);

  function incrementQuantity() {
    setQuantity((q) => q + 1);
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  }

  return (
    <>
      <TableData>{data.name}</TableData>
      <TableData>${data.price}</TableData>
      <TableData>
        <div className="w-32 h-12 m-auto">
          <Quantity
            quantity={quantity}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
        </div>
      </TableData>
      <TableData>${(data.price * quantity).toFixed(2)}</TableData>

      <TableData>
        <button onClick={() => RemoveFromCartAction(data.product_id)}>
          <FaTrash className="text-red-500 cursor-pointer hover:text-primary-dark" />
        </button>
      </TableData>
    </>
  );
}
