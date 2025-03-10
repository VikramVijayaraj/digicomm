"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/actions/auth-actions";

export default function ResetPasswordForm({ user }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    const { password, confirmPassword } = values;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check token expiration
    const today = new Date();
    if (today > user.reset_password_token_expiry) {
      setError("Password reset token has expired. Redirecting...");
      setTimeout(() => {
        router.replace("/auth/signin");
      }, 3000);
      return;
    }

    // Update new password
    const isUpdated = await updatePassword(user.email, password);

    if (isUpdated.success) {
      setError(null);
      setResetSuccess(true);
      setTimeout(() => {
        router.replace("/auth/signin");
      }, 3000);
    } else {
      setError(isUpdated.error);
      return;
    }
  }

  return (
    <>
      <AlertDialog open={resetSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Password Reset Successful
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You can now sign in with your new password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <p className="mt-6 w-full text-center">
              Redirecting to Sign In page...
            </p>
            {/* <AlertDialogAction asChild>
              <Link href="/auth/signin" className="w-full">
                Sign In
              </Link>
            </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
