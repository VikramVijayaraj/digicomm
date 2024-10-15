"use client";

import { useState, useOptimistic } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import Quantity from "./quantity";
import { Button } from "../ui/button";
import { addToCartAction } from "@/actions/cart-action";

export default function AddToCart({ product, initialCartItems }) {
  const { slug } = useParams();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const [optimisticCartItems, addOptimisticCartItem] = useOptimistic(
    initialCartItems,
    (state, newItem) => {
      // const existingItemIndex = state.findIndex(
      //   (item) => item.product_id === newItem.product_id,
      // );
      // if (existingItemIndex > -1) {
      //   // If the item already exists, update its quantity
      //   const newState = [...state];
      //   newState[existingItemIndex] = {
      //     ...newState[existingItemIndex],
      //     quantity: newState[existingItemIndex].quantity + newItem.quantity,
      //     total_price:
      //       (newState[existingItemIndex].quantity + newItem.quantity) *
      //       newState[existingItemIndex].price,
      //   };
      //   return newState;
      // } else {
      //   // If it's a new item, add it to the cart
      //   return [...state, newItem];
      // }
      return [...state, newItem];
    },
  );

  function incrementQuantity() {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  }

  async function handleAddToCart() {
    setIsAdding(true);

    // Optimistically update the cart

    const optimisticCartItem = {
      product_id: product.product_id,
      name: product.product_name,
      quantity: quantity,
      price: product.price,
      description: product.product_desc,
      stock: product.stock,
      slug: product.slug,
      total_price: quantity * product.price,
    };
    addOptimisticCartItem(optimisticCartItem);

    try {
      await addToCartAction(slug, quantity);
      toast.success("Product added to cart successfully.");
      router.push("/your/cart");
    } catch (error) {
      toast.error("Failed to add the product to cart. Please try again.");

      // Remove the optimistic update if there's an error
      addOptimisticCartItem(
        optimisticCartItems.filter(
          (item) => item.product_id !== optimisticCartItems.product_id,
        ),
      );
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div>
      <div
        className="flex flex-col md:flex-row justify-between h-24 md:h-10 md:space-x-2 space-y-4
          md:space-y-0"
      >
        {/* Product quantity */}
        <Quantity
          quantity={quantity}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
        />

        {/* Add to cart button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex items-center text-base grow w-full md:w-28 bg-primary rounded-sm
            select-none"
        >
          {isAdding ? "Adding..." : "Add To Cart"}
        </Button>
      </div>

      {/* Stock status */}
      <div className="text-center md:text-left mt-2">
        {product.stock <= 10 && (
          <p className="text-red-700 select-none font-semibold">
            Only {product.stock} items left!
          </p>
        )}
      </div>
    </div>
  );
}
