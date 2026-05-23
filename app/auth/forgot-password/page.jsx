"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { forgotPassword } from "@/actions/auth-actions";

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

    const user = await getUserByEmailAction(values.email);

    if (user) {
      const result = await forgotPassword(values.email);

      if (result.status === "success") {
        setIsEmailSent(true);
      } else {
        setError(result.status);
      }
    } else {
      setError("Email not found. Please try again.");
    }
  }

  if (isEmailSent) {
    return (
      <main className="min-h-screen">
        <div className="global-padding flex min-h-screen items-center justify-center py-10">
          <div className="w-full max-w-lg">
            <Card className="rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <CardHeader className="space-y-5 p-6 sm:p-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-green-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                    <ShieldCheck className="h-4 w-4" />
                    Recovery Email Sent
                  </div>

                  <CardTitle className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                    Check your inbox
                  </CardTitle>

                  <CardDescription className="text-base leading-7 text-slate-600">
                    We've sent a password reset link to your email address.
                    Follow the instructions in the email to reset your password.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="h-12 flex-1 rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
                  >
                    <Link href="/auth/signin">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Return to Login
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="global-padding py-6 pb-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          {/* <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Account Recovery
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Forgot your password?
              </h1>

              <p className="mt-3 text-base leading-7 text-slate-600">
                Enter your registered email address and we'll send you a secure
                password reset link.
              </p>
            </div>
          </section> */}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <CardHeader className="space-y-2 p-5 sm:p-6">
                <CardTitle className="text-2xl font-semibold text-slate-950">
                  Reset Password
                </CardTitle>

                <CardDescription className="text-sm leading-6 text-slate-600">
                  We'll email you a secure reset link to regain access to your
                  account.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] sm:p-6">
                      <div className="space-y-5">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700">
                                Email Address
                              </FormLabel>

                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                                  <Input
                                    placeholder="Enter your email"
                                    {...field}
                                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 pl-12 text-base shadow-none placeholder:text-slate-400"
                                  />
                                </div>
                              </FormControl>

                              <p className="text-sm text-slate-500">
                                Use the email associated with your Crelands
                                account.
                              </p>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5">
                        <p className="text-sm font-medium text-red-700">
                          {error}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          New to Crelands?{" "}
                          <Link
                            href="/auth/signup"
                            className="font-semibold text-primary-brand hover:underline"
                          >
                            Create an account
                          </Link>
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                        className="h-12 flex-1 rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
                      >
                        {form.formState.isSubmitting ? (
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Reset Link
                          </>
                        )}
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        className="h-12 rounded-full border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                      >
                        <Link href="/auth/signin">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Login
                        </Link>
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-semibold text-slate-950">
                  Secure Recovery
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Password reset links are securely generated and expire
                  automatically for your protection.
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    "Secure email verification",
                    "Protected account recovery",
                    "Fast reset process",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div className="h-2.5 w-2.5 rounded-full bg-primary-brand" />

                      <p className="text-sm font-medium text-slate-700">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
