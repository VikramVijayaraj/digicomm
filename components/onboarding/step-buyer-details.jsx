"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userSchema } from "@/lib/schema";
import { UserDetailsAction } from "@/actions/user-actions";

export default function StepBuyerDetails({ onContinue, onSkip }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "India",
      zipCode: "",
    },
  });

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      await UserDetailsAction(data);
      toast.success("Delivery details saved!");
      onContinue();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 mb-5">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
          <MapPin className="h-5 w-5" />
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Set up your delivery details
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add your address so you&#39;re ready to check out instantly when you
          find something you love.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                    {...field}
                  />
                </FormControl>
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
                  Phone
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="10-digit phone number"
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Address Line 1
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="House/flat no., building, street"
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Address Line 2
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Area, landmark (optional)"
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City"
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    State
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="State"
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Country"
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Zip Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="6-digit pin code"
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onSkip}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 underline-offset-4 hover:underline"
            >
              Skip for now
            </button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-full bg-linear-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
            >
              {isSubmitting ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
