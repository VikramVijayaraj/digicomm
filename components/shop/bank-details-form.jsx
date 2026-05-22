"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { paymentDetailsSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Asterisk } from "lucide-react";
import {
  createSellerBankDetailsAction,
  updateSellerBankDetailsAction,
} from "@/actions/seller-actions";
import { notifyOnSlack } from "@/lib/api";

const inputClassName =
  "h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none";

export default function BankDetailsForm({ session, existingData }) {
  const form = useForm({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      accountHolderName: existingData ? existingData.account_holder_name : "",
      accountNumber: existingData ? existingData.account_number : "",
      ifscCode: existingData ? existingData.ifsc_code : "",
      phone: existingData ? existingData.phone : "",
    },
  });

  const router = useRouter();

  async function onSubmit(values) {
    // Send payment details to the server
    try {
      if (existingData) {
        await updateSellerBankDetailsAction(session?.user?.email, values);
      } else {
        await createSellerBankDetailsAction(session?.user?.email, values);
      }
      router.refresh();
      toast.success("Bank details saved successfully!");

      // Notify on Slack
      await notifyOnSlack(
        `${session?.user?.email} has added/updated their bank details.`,
      );
    } catch (err) {
      console.error("Error creating bank details:", err);
      toast.error("Failed to save bank details!");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-5"
      >
        <FormField
          control={form.control}
          name="accountHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                Account Holder Name <Asterisk stroke="red" size={13} />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-sm text-slate-500">
                Enter the full name as it appears on your bank account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                Account Number <Asterisk stroke="red" size={13} />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="123456789"
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-sm text-slate-500">
                Enter your bank account number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ifscCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                IFSC Code <Asterisk stroke="red" size={13} />
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="SBIN0123456"
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-sm text-slate-500">
                Enter the IFSC code of your bank branch.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-slate-700">
                Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="9876543210"
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-sm text-slate-500">
                Enter your registered mobile number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="h-12 rounded-full bg-gradient-to-r from-primary-brand to-red-400 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Bank Details"}
        </Button>
      </form>
    </Form>
  );
}
