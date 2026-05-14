import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionLayout({
  children,
  heading,
  eyebrow,
  description,
  actionHref,
  actionLabel,
  align = "center",
}) {
  const isCentered = align === "center";

  return (
    <section>
      <div
        className={`pb-6 md:pb-10 ${
          isCentered ? "text-center" : "flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        }`}
      >
        <div className={isCentered ? "" : "max-w-2xl"}>
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
            {heading}
          </h2>
          {description && (
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {description}
            </p>
          )}
        </div>

        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-transform hover:translate-x-1 hover:text-slate-950"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
