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
    } catch (err) {
      console.error("Error creating bank details:", err);
      toast.error("Failed to save bank details!");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full flex flex-col"
      >
        <FormField
          control={form.control}
          name="accountHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Account Holder Name <Asterisk stroke="red" size={13} />
              </FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
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
              <FormLabel className="flex items-center gap-1">
                Account Number <Asterisk stroke="red" size={13} />
              </FormLabel>
              <FormControl>
                <Input placeholder="123456789" {...field} />
              </FormControl>
              <FormDescription>Enter your bank account number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ifscCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                IFSC Code <Asterisk stroke="red" size={13} />
              </FormLabel>

              <FormControl>
                <Input placeholder="SBIN0123456" {...field} />
              </FormControl>
              <FormDescription>
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="number" placeholder="9876543210" {...field} />
              </FormControl>
              <FormDescription>
                Enter your registered mobile number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
