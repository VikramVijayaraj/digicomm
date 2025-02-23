"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { productReviewSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/ui/star-rating";
import {
  addProductReviewAction,
  addShopReviewAction,
} from "@/actions/review-actions";

export default function AddReviewForm({ session, productId, sellerId }) {
  const form = useForm({
    resolver: zodResolver(productReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values) {
    // Call server action based on the productId or sellerId
    if (productId) {
      const reviewData = { ...values, productId };
      await addProductReviewAction(session?.user?.email, reviewData);
    } else if (sellerId) {
      const reviewData = { ...values, sellerId };
      await addShopReviewAction(session?.user?.email, reviewData);
    }

    router.back();
    toast.success("Review added successfully.");
  }

  return (
    <div className="global-padding flex flex-col items-center justify-between space-y-12 pt-8">
      <h3 className="text-2xl">Add Review</h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-md w-full flex flex-col gap-8 min-h-screen"
        >
          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Rating</FormLabel>
                <FormControl>
                  <StarRating rating={field.value} setRating={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Comment */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Comment</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell something..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
