"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PartyPopper,
  ArrowRight,
  ExternalLink,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { completeOnboardingAction } from "@/actions/user-actions";

const confettiDots = [
  { color: "bg-orange-400", size: "h-2 w-2", top: "0%", left: "20%", delay: "0s" },
  { color: "bg-blue-400", size: "h-1.5 w-1.5", top: "10%", left: "75%", delay: "0.2s" },
  { color: "bg-green-400", size: "h-2.5 w-2.5", top: "5%", left: "45%", delay: "0.4s" },
  { color: "bg-pink-400", size: "h-2 w-2", top: "15%", left: "10%", delay: "0.6s" },
  { color: "bg-purple-400", size: "h-1.5 w-1.5", top: "8%", left: "90%", delay: "0.1s" },
  { color: "bg-orange-300", size: "h-2 w-2", top: "20%", left: "60%", delay: "0.3s" },
  { color: "bg-blue-300", size: "h-1.5 w-1.5", top: "2%", left: "35%", delay: "0.5s" },
  { color: "bg-pink-300", size: "h-2 w-2", top: "12%", left: "55%", delay: "0.7s" },
  { color: "bg-green-300", size: "h-2.5 w-2.5", top: "18%", left: "85%", delay: "0.15s" },
  { color: "bg-purple-300", size: "h-1.5 w-1.5", top: "6%", left: "5%", delay: "0.45s" },
];

export default function StepCelebration({ userType, shopSlug }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const isSeller = userType === "seller";

  async function handleContinue() {
    setIsNavigating(true);
    try {
      const result = await completeOnboardingAction();

      if (!result.success) {
        toast.error(result.error);
        setIsNavigating(false);

        if (result.requiresSignIn) {
          router.push("/auth/signin");
        }

        return;
      }

      router.push(isSeller ? "/your/shop/dashboard" : "/");
    } catch (error) {
      console.error(error);
      toast.error("Unable to complete onboarding. Please try again.");
      setIsNavigating(false);
    }
  }

  return (
    <div className="flex flex-col items-center text-center py-8 sm:py-12">
      {/* Confetti animation */}
      <div className="relative h-16 w-full max-w-sm">
        {confettiDots.map((dot, i) => (
          <span
            key={i}
            className={`absolute rounded-full ${dot.color} ${dot.size} animate-bounce`}
            style={{
              top: dot.top,
              left: dot.left,
              animationDelay: dot.delay,
              animationDuration: "1.5s",
            }}
          />
        ))}
      </div>

      {/* Party icon */}
      <div className="relative mb-6">
        <div
          className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-orange-100 to-orange-50 animate-bounce"
          style={{ animationDuration: "2s" }}
        >
          <PartyPopper className="h-10 w-10 text-primary-brand" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-slate-950 mt-2">
        You&apos;re all set!
      </h2>

      {/* Subtitle */}
      <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
        {isSeller
          ? "Your store is live on Crelands! Start managing your products and orders from your seller dashboard."
          : "Welcome to Crelands! You're ready to discover amazing digital products from talented creators."}
      </p>

      {/* Primary CTA — marks onboarding complete on click, then navigates */}
      <div className="mt-8">
        <Button
          onClick={handleContinue}
          disabled={isNavigating}
          className="h-12 rounded-full bg-linear-to-r from-primary-brand to-red-400 px-8 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
        >
          {isNavigating ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {isSeller ? "Opening dashboard..." : "Loading..."}
            </>
          ) : (
            <>
              {isSeller ? "Go to your dashboard" : "Start exploring"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Secondary links */}
      {/* <div className="mt-4 flex gap-4">
        {isSeller ? (
          <button
            onClick={handleContinue}
            disabled={isNavigating}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
          >
            View your public store
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={handleContinue}
            disabled={isNavigating}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
          >
            Browse categories
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}
      </div> */}

      {/* Info card */}
      <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-4 max-w-md">
        <p className="inline-flex items-start gap-2 text-sm leading-6 text-slate-600">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
          <span>
            {isSeller
              ? "Tip: Share your store link on social media to get your first customers!"
              : "Tip: Add items to your cart and check out to get instant digital delivery!"}
          </span>
        </p>
      </div>
    </div>
  );
}
