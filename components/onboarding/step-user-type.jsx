"use client";

import { useState } from "react";
import { ShoppingBag, Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userTypes = [
  {
    value: "buyer",
    icon: ShoppingBag,
    title: "I want to buy",
    description: "Browse and purchase digital products from talented creators.",
    iconContainerClass: "bg-blue-50 text-blue-600",
  },
  {
    value: "seller",
    icon: Store,
    title: "I want to sell",
    description: "Create your shop and start selling your digital products.",
    iconContainerClass: "bg-orange-50 text-primary-brand",
  },
];

const sourceOptions = [
  { value: "google", label: "Google Search" },
  { value: "blog", label: "Our Blog" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "Email" },
  { value: "pinterest", label: "Pinterest" },
  { value: "facebook", label: "Facebook" },
  { value: "other", label: "Other" },
];

export default function StepUserType({ onContinue }) {
  const [selectedType, setSelectedType] = useState(null);
  const [source, setSource] = useState("");
  const [otherSource, setOtherSource] = useState("");

  const isDisabled =
    !selectedType || !source || (source === "other" && !otherSource.trim());

  const handleContinue = () => {
    if (isDisabled) return;
    onContinue({
      userType: selectedType,
      source: source === "other" ? `Other: ${otherSource}` : source,
    });
  };

  return (
    <div>
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-slate-950">
        What brings you to Crelands?
      </h2>
      <p className="text-base leading-7 text-slate-600 mt-2">
        Choose how you&apos;d like to use Crelands. You can always do both
        later.
      </p>

      {/* Selection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.value;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => setSelectedType(type.value)}
              className={`rounded-[1.75rem] border-2 p-6 text-left transition-all ${
                isSelected
                  ? "border-primary-brand bg-orange-50/50 shadow-sm ring-1 ring-orange-200"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-4 ${type.iconContainerClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-lg font-semibold text-slate-950">
                {type.title}
              </div>
              <p className="text-sm leading-6 text-slate-600 mt-1">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Attribution source */}
      {selectedType && (
        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] sm:p-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            How did you find out about Crelands?
          </p>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none">
              <SelectValue placeholder="Select a source" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {source === "other" && (
            <Input
              className="mt-3 h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
              placeholder="Enter how you found us"
              value={otherSource}
              onChange={(e) => setOtherSource(e.target.value)}
            />
          )}
        </div>
      )}

      {/* Continue button */}
      <div className="mt-8 flex justify-end">
        <Button
          type="button"
          disabled={isDisabled}
          onClick={handleContinue}
          className="h-12 rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-8 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
