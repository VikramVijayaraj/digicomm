"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Rocket } from "lucide-react";

import StepIndicator from "./step-indicator";
import StepUserType from "./step-user-type";
import StepStoreSetup from "./step-store-setup";
import StepProductListing from "./step-product-listing";
import StepBuyerDetails from "./step-buyer-details";
import StepCelebration from "./step-celebration";
import { createUserSourceAction } from "@/actions/user-actions";

const SELLER_STEPS = [
  { label: "Get started" },
  { label: "Create store" },
  { label: "List product" },
  { label: "Done" },
];

const BUYER_STEPS = [
  { label: "Get started" },
  { label: "Delivery details" },
  { label: "Done" },
];

export default function OnboardingWizard({ session, categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStep = parseInt(searchParams.get("step") || "0", 10);

  const [currentStep, setCurrentStep] = useState(
    isNaN(initialStep) ? 0 : initialStep,
  );
  const [userType, setUserType] = useState(null);
  const [shopSlug, setShopSlug] = useState("");

  const updateStep = useCallback(
    (step) => {
      setCurrentStep(step);
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", step.toString());
      router.replace(`/welcome?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Step 1: User type + attribution
  async function handleUserTypeSubmit({ userType: type, source }) {
    try {
      await createUserSourceAction(source);
    } catch (error) {
      console.error("Error saving source:", error);
    }
    setUserType(type);
    updateStep(1);
  }

  // Seller Step 2: Store created
  function handleStoreCreated({ shopSlug: slug }) {
    setShopSlug(slug);
    updateStep(2);
  }

  // Seller Step 3: Product listed (or skipped)
  function handleProductListed() {
    updateStep(3);
  }

  function handleProductSkipped() {
    updateStep(3);
  }

  // Buyer Step 2: Delivery details saved (or skipped)
  function handleBuyerDetailsSaved() {
    updateStep(2);
  }

  function handleBuyerDetailsSkipped() {
    updateStep(2);
  }

  const steps = userType === "seller" ? SELLER_STEPS : BUYER_STEPS;

  function renderCurrentStep() {
    // Step 0: User type selection (always)
    if (currentStep === 0) {
      return <StepUserType onContinue={handleUserTypeSubmit} />;
    }

    if (userType === "seller") {
      switch (currentStep) {
        case 1:
          return (
            <StepStoreSetup session={session} onContinue={handleStoreCreated} />
          );
        case 2:
          return (
            <StepProductListing
              session={session}
              categories={categories}
              onContinue={handleProductListed}
              onSkip={handleProductSkipped}
            />
          );
        case 3:
          return <StepCelebration userType="seller" shopSlug={shopSlug} />;
        default:
          return <StepUserType onContinue={handleUserTypeSubmit} />;
      }
    }

    if (userType === "buyer") {
      switch (currentStep) {
        case 1:
          return (
            <StepBuyerDetails
              onContinue={handleBuyerDetailsSaved}
              onSkip={handleBuyerDetailsSkipped}
            />
          );
        case 2:
          return <StepCelebration userType="buyer" />;
        default:
          return <StepUserType onContinue={handleUserTypeSubmit} />;
      }
    }

    // Fallback: if userType not set but step > 0, reset to step 0
    return <StepUserType onContinue={handleUserTypeSubmit} />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Page header */}
      <section className="mb-8 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Welcome to Crelands
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Let&apos;s get you set up. This takes less than 2 minutes.
          </p>
        </div>
      </section>

      {/* Step indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Step content */}
      <div className="min-h-[400px]">{renderCurrentStep()}</div>
    </div>
  );
}
