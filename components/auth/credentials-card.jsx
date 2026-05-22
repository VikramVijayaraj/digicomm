"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, UserRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SignInForm from "./signin-form";
import SignUpForm from "./signup-form";
import { signInWithGoogle } from "@/actions/auth-actions";

export default function CredentialsCard({ page }) {
  async function handleSignIn() {
    await signInWithGoogle();
  }

  const isSignin = page === "signin";

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center lg:py-10">
      <section className="order-2 lg:order-1 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-7 lg:min-h-[520px]">
        <div className="flex h-full flex-col justify-between gap-10">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Crelands account
            </div>
            <h1 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              {isSignin
                ? "Welcome back to your creator marketplace."
                : "Create your Crelands account."}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              {isSignin
                ? "Sign in to manage your purchases, seller workspace, products, and orders from one secure account."
                : "Join Crelands to buy digital products, launch your shop, and manage everything from a clean workspace."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-[1.5rem] border border-gray-100 bg-white/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">
                Secure access
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Protected login for buyer and seller workflows.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-gray-100 bg-white/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">
                Instant workspace
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Access products, orders, and downloads after signing in.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Card className="order-1 lg:order-2 rounded-[1.75rem] border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <CardHeader className="p-5 sm:p-6">
          {/* <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
            <UserRound className="h-4 w-4" />
            {isSignin ? "Sign in" : "Sign up"}
          </div> */}
          <CardTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {isSignin ? "Sign In" : "Sign Up"}
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-600">
            {isSignin
              ? "Enter your credentials to access your account."
              : "Create a new account to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
          <Button
            onClick={handleSignIn}
            className="h-12 w-full gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            type="submit"
          >
            <Image
              src="/logos/google.svg"
              width={16}
              height={16}
              alt=""
              unoptimized={true}
            />
            Continue with Google
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              OR
            </span>
            <Separator className="flex-1 bg-slate-200" />
          </div>

          {isSignin ? <SignInForm /> : <SignUpForm />}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-center sm:px-6">
          {isSignin && (
            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold text-primary-brand hover:underline"
            >
              Forgot Password?
            </Link>
          )}

          {isSignin ? (
            <p className="text-sm text-slate-600">
              Don&#39;t have an account?
              <Link
                href="signup"
                className="ml-1 text-sm font-semibold text-primary-brand hover:underline"
              >
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="text-sm text-slate-600">
              Already have an account?
              <Link
                href="signin"
                className="ml-1 text-sm font-semibold text-primary-brand hover:underline"
              >
                Sign In
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
