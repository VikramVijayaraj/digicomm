import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { getStoragePath } from "@/utils/utils";

export default function PostCard({ title, category, image }) {
  const imagePath = getStoragePath(image);

  return (
    <div className="group h-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.04)] transition-colors hover:border-orange-200 hover:bg-slate-50/70">
      <div className="relative h-[280px] w-full overflow-hidden rounded-t-[1.5rem] bg-slate-50">
        <Image
          src={imagePath}
          alt={title}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
        />
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <p className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
          {category}
        </p>
        <div className="flex items-start justify-between gap-4">
          <h2 className="line-clamp-2 text-lg font-semibold leading-6 tracking-[-0.03em] text-slate-950">
            {title}
          </h2>
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors group-hover:border-orange-200 group-hover:text-primary-brand">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
