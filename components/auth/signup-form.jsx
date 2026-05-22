"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/schema";
import { signUp } from "@/actions/auth-actions";

export default function SignUpForm() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const result = await signUp(values);

      if (result.status === "success") {
        setSuccessMessage("Check your email to verify, then sign in.");
        form.reset();
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } else {
        form.setError("root", { message: result.status });
      }
    } catch (error) {
      console.error("Signup error:", error);
      form.setError("root", {
        message:
          error.message || "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
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
                  placeholder="Enter your name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-slate-700">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-slate-700">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {successMessage && (
          <p className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {successMessage}
          </p>
        )}

        {form.formState.errors.root && (
          <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          className="h-12 w-full rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  );
}
