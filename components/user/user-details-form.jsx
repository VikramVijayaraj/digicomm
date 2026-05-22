"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { Home, MapPin, UserRound } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { userSchema } from "@/lib/schema";
import { UserDetailsAction } from "@/actions/user-actions";

const inputClassName =
  "h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none";

function FieldGroup({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="mb-5 flex items-start gap-4">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function UserDetailsForm({ data, callbackUrl }) {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: data
        ? [data.first_name, data.last_name].filter(Boolean).join(" ")
        : "",
      phone: data?.phone || "",
      address1: data?.address_line1 || "",
      address2: data?.address_line2 || "",
      city: data?.city || "",
      state: data?.state || "",
      country: data?.country || "",
      zipCode: data?.zip_code || "",
    },
  });

  const pathname = usePathname();
  const isRegister = pathname === "/register";

  async function onSubmit(values) {
    await UserDetailsAction(values);
    toast.success("Data Saved Successfully.");

    if (callbackUrl) {
      window.location.href = callbackUrl;
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
      {isRegister && (
        <div className="mb-6 border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-semibold text-slate-950">Register</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add your details to finish setting up your account.
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup
            icon={UserRound}
            title="Personal Details"
            description="Basic information used for your account and order communication."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className={inputClassName}
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
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your mobile number"
                        className={inputClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FieldGroup>

          <FieldGroup
            icon={Home}
            title="Delivery Address"
            description="Saved address details make future purchases faster."
          >
            <div className="grid gap-5">
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
                        placeholder="Enter your delivery address line 1"
                        className={inputClassName}
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
                        placeholder="Enter your delivery address line 2"
                        className={inputClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FieldGroup>

          <FieldGroup
            icon={MapPin}
            title="Location"
            description="City, state, country, and PIN code for delivery records."
          >
            <div className="grid gap-5 md:grid-cols-2">
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
                        placeholder="Enter your city"
                        className={inputClassName}
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
                        placeholder="Enter your state"
                        className={inputClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="Enter your country"
                        className={inputClassName}
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
                        type="number"
                        placeholder="Enter your zip code"
                        className={inputClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FieldGroup>

          <div className="flex justify-end">
            <Button
              className="h-12 w-full rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand sm:w-auto"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Details"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
