"use client";

import { getLeadAction, storeLeadAction } from "@/actions/lead-actions";
import { isValidEmail } from "@/utils/utils";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    // Validate email format
    const validEmail = isValidEmail(email);
    if (!validEmail) {
      toast.error("Please enter a valid email address");
      return;
    }

    const emailExists = await getLeadAction(email);
    if (emailExists) {
      toast.info("You are already subscribed to our newsletter.");
      return;
    }

    try {
      // Store the email in db
      await storeLeadAction(email);

      setEmail("");
      toast.success("Thank you for subscribing to our newsletter!");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Failed to subscribe. Please try again later.");
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,245,238,1)_0%,rgba(255,255,255,1)_52%,rgba(244,247,255,1)_100%)] px-6 py-10 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:px-8 lg:px-12">
      <div className="absolute left-0 top-0 h-40 w-40 -translate-x-1/4 -translate-y-1/4 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-48 w-48 translate-x-1/4 translate-y-1/4 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
            <Mail className="h-4 w-4 text-primary-brand" />
            Stay in the loop
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
            Get product drops, buyer picks, and creator tips in your inbox
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
            Subscribe for curated product highlights, launch ideas for sellers,
            and updates from {process.env.NEXT_PUBLIC_APP_NAME}.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
        >
          <label className="mb-3 block text-sm font-medium text-slate-600">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="h-14 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-slate-300"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Occasional updates only. No noisy spam, just useful launches and
            offers.
          </p>
        </form>
      </div>
    </section>
  );
}
