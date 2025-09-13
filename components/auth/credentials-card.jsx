"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

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

export default function CredentialsCard({ page }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();

  async function handleSignIn(e) {
    e.preventDefault();
    try {
      const result = await signIn("google", {
        callbackUrl: callbackUrl || "/",
        redirect: false,
      });

      if (result?.error) {
        // Handle errors, e.g., show an error message
        console.error("Sign in error:", result.error);
      } else if (result?.url) {
        // Successful sign-in, redirect using Next.js router
        router.push(result.url);
      }
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
    }
  }

  return (
    <Card className="w-full md:w-[400px] m-auto">
      <CardHeader>
        <CardTitle>{page === "signin" ? "Sign In" : "Sign Up"}</CardTitle>
        <CardDescription>
          {page === "signin"
            ? "Enter your credentials to access your account"
            : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleSignIn}
          className="w-full gap-2"
          type="submit"
          // variant="outline"
        >
          <Image src="/logos/google.svg" width={15} height={15} alt="" />
          Continue with Google
        </Button>
        {/* <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button className="w-full" type="submit" variant="outline">
              Continue with Google
            </Button>
          </form> */}

        {/* Separator */}
        <div className="flex justify-between items-center">
          <Separator className="w-[40%]" />
          <span className="text-sm text-gray-500">OR</span>
          <Separator className="w-[40%]" />
        </div>

        {/* Form */}
        {page === "signin" ? <SignInForm /> : <SignUpForm />}
      </CardContent>
      <CardFooter
        className="flex flex-col md:flex-row items-center md:justify-between md:items-center
          space-y-2 md:space-y-0"
      >
        {page === "signin" && (
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-700 hover:underline"
          >
            Forgot Password?
          </Link>
        )}

        {page === "signin" ? (
          <p className="text-sm text-center">
            Don&#39;t have an account?
            <Link
              href="signup"
              className="text-sm ml-1 text-blue-700 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        ) : (
          <p className="text-sm text-center m-auto">
            Already have an account?
            <Link
              href="signin"
              className="text-sm ml-1 text-blue-700 hover:underline"
            >
              Sign In
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
