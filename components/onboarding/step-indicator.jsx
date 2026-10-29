"use client";

import { Fragment } from "react";
import { Check } from "lucide-react";

export default function StepIndicator({ steps = [], currentStep = 0 }) {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <Fragment key={index}>
              {/* Circle + label column */}
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-linear-to-r from-primary-brand to-red-400 text-white"
                      : "border-2 border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Label (hidden on mobile) */}
                <span
                  className={`text-xs mt-2 text-center hidden sm:block ${
                    isCompleted
                      ? "text-slate-700 font-medium"
                      : isActive
                      ? "text-slate-950 font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {typeof step === "object" ? step?.label : step}
                </span>
              </div>

              {/* Connecting line (not after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    index < currentStep - 1
                      ? "bg-green-500"
                      : index === currentStep - 1
                      ? "bg-linear-to-r from-green-500 to-primary-brand"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
