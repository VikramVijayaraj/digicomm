"use client";

import { useState } from "react";
import { CheckCircle2, Copy } from "lucide-react";

export default function CopyStoreUrlButton({ shopSlug }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!shopSlug) return;

    try {
      const url = `${window.location.origin}/shop/${shopSlug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy store URL:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
    >
      {copied ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Copied
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" /> Copy store URL
        </>
      )}
    </button>
  );
}
