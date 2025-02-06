"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { orderTrackingEmailSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { sendOrderTrackingEmail } from "@/actions/send-email-action";

export default function OrderTrackingEmailForm({ buyerDetails }) {
  const form = useForm({
    resolver: zodResolver(orderTrackingEmailSchema),
    defaultValues: {
      deliveryServiceProvider: "",
      trackingNumber: "",
    },
  });

  async function onSubmit(values) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Send email
    const result = await sendOrderTrackingEmail(buyerDetails, formData);

    if (result.success) {
      toast.success("Email sent successfully.");
      form.reset();
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg text-gray-600">Send Tracking Information</h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 flex flex-col gap-4"
        >
          {/* Rating */}
          <FormField
            control={form.control}
            name="deliveryServiceProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Service Provider</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Comment */}
          <FormField
            control={form.control}
            name="trackingNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tracking Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Sending..." : "Send Email"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
