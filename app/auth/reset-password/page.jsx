import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ResetPasswordForm from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage() {
  return (
    <main className="min-h-screen">
      <div className="global-padding py-6 pb-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          {/* Header */}
          {/* <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Secure Password Reset
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Create a new password
              </h1>

              <p className="mt-3 text-base leading-7 text-slate-600">
                Your new password should be secure, unique, and at least 8
                characters long.
              </p>
            </div>
          </section> */}

          {/* Content */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Main Form */}
            <Card className="rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <CardHeader className="space-y-2 p-5 sm:p-6">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-50 text-primary-brand">
                  <KeyRound className="h-7 w-7" />
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-2xl font-semibold text-slate-950">
                    Reset Password
                  </CardTitle>

                  <CardDescription className="text-sm leading-6 text-slate-600">
                    Enter your new password below to regain access to your
                    account securely.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] sm:p-6">
                  <ResetPasswordForm />
                </div>

                <div className="mt-6">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-semibold text-slate-950">
                  Password Guidelines
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use a strong password that’s difficult to guess and easy for
                  you to remember.
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    "Minimum 8 characters",
                    "Use uppercase and lowercase letters",
                    "Include numbers or symbols",
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
