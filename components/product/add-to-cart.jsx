"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Quantity from "./quantity";
import { Button } from "../ui/button";
import { addToCartAction } from "@/actions/cart-action";

const initialState = {
  status: "idle",
  message: "",
};

export default function AddToCart({ product }) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const addProductToCart = addToCartAction.bind(null, product.product_slug);
  const [state, formAction, isPending] = useActionState(
    addProductToCart,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      router.push("/your/cart");
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [router, state]);

  const incrementQuantity = () => setQuantity((current) => current + 1);
  const decrementQuantity = () =>
    setQuantity((current) => Math.max(1, current - 1));

  return (
    <form action={formAction}>
      <input name="quantity" type="hidden" value={quantity} readOnly />
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="w-full md:flex-1">
          <Quantity
            quantity={quantity}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            disabled={isPending}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="h-14 w-full rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-base font-semibold text-white transition hover:from-primary-light hover:to-primary-brand md:flex-1 select-none"
        >
          {isPending ? "Adding..." : "Add to cart"}
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">
        {state.message}
      </p>
    </form>
  );
}
