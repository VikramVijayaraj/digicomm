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
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,245,238,1)_0%,rgba(255,255,255,1)_52%,rgba(244,247,255,1)_100%)] px-4 py-7 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:px-8 sm:py-10 lg:px-12">
      <div className="absolute left-0 top-0 h-40 w-40 -translate-x-1/4 -translate-y-1/4 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-48 w-48 translate-x-1/4 translate-y-1/4 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative grid gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 sm:mb-4 sm:gap-3 sm:px-4 sm:text-sm sm:tracking-[0.18em]">
            <Mail className="h-3.5 w-3.5 text-primary-brand sm:h-4 sm:w-4" />
            Stay in the loop
          </div>
          <h2 className="max-w-[18rem] text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:max-w-none sm:text-3xl md:text-4xl">
            Get product drops, buyer picks, and creator tips in your inbox
          </h2>
          <p className="mt-3 max-w-[18.5rem] text-[15px] leading-6 text-slate-600 sm:mt-4 sm:max-w-xl sm:text-base sm:leading-7 md:text-lg">
            Subscribe for curated product highlights, launch ideas for sellers,
            and updates from {process.env.NEXT_PUBLIC_APP_NAME}.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.5rem] border border-white/80 bg-white/90 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:rounded-[1.75rem] sm:p-5"
        >
          <label className="mb-2 block text-xs font-semibold text-slate-500 sm:mb-3 sm:text-sm sm:font-medium sm:text-slate-600">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="h-16 flex-1 rounded-[1rem] border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 sm:h-14 sm:rounded-2xl"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="inline-flex h-16 items-center justify-center rounded-[1rem] bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 sm:h-14 sm:rounded-2xl"
            >
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 max-w-[18rem] text-[11px] leading-5 text-slate-500 sm:max-w-none sm:text-sm sm:leading-6">
            Occasional updates only. No noisy spam, just useful launches and
            offers.
          </p>
        </form>
      </div>
    </section>
  );
}
