"use client";

import { Info, ArrowRight } from "lucide-react";
import ProductDetailsForm from "@/components/product/product-details-form";

export default function StepProductListing({
  session,
  categories,
  onContinue,
  onSkip,
}) {
  function handleProductSuccess() {
    onContinue();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p className="text-sm leading-6 text-blue-800">
          This is your full product editor. You can always update these details
          later from your seller dashboard.
        </p>
      </div>

      <ProductDetailsForm
        session={session}
        categories={categories}
        onSuccess={handleProductSuccess}
      />

      <div className="flex justify-center pb-4">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
        >
          Skip for now — you can list your first product anytime from your seller
          dashboard
        </button>
      </div>
    </div>
  );
}
