"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/schema";
import { getUserByEmailAction } from "@/actions/user-actions";
import { sendResetLink } from "@/actions/send-email-action";

export default function ForgotPasswordPage() {
  const [error, setError] = useState(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values) {
    setError(null);

    // Check whether the email is stored in the database
    const user = await getUserByEmailAction(values.email);

    if (user) {
      // Send a reset link to the user's email
      const result = await sendResetLink(values.email);

      if (result.success) {
        setIsEmailSent(true);
      } else {
        setError(result.error);
      }
    } else {
      // Display an error message if the email is not found
      setError("Email not found. Please try again.");
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen">
        <Card className="w-full md:w-[400px] m-auto">
          <CardHeader>
            <CardTitle>Reset Link Sent</CardTitle>
          </CardHeader>
          <CardContent>
            We've sent a reset link to your email. Please check your inbox.
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/auth/signin">Return to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Card className="w-full md:w-[400px] m-auto">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Reset your password by entering your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <FormMessage>{error}</FormMessage>}

              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full"
              >
                {form.formState.isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Send me a reset link"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
