import Image from "next/image";
import { IndianRupee } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoragePath } from "@/utils/utils";

export default function ProductCard({ imgUrl, name, price, category }) {
  const imagePath = getStoragePath(imgUrl);
  const fallbackImage = "/images/image-avatar.svg";

  return (
    <Card className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.1)]">
      <CardHeader className="m-0 p-0">
        <CardTitle className="relative h-[220px] lg:h-[280px] w-full overflow-hidden bg-slate-100">
          <Image
            src={imagePath || fallbackImage}
            fill
            alt={name || "Product image"}
            style={{ objectFit: "contain" }}
            className="transition duration-500 group-hover:scale-[1.04]"
            // Keep this: only fallback images should skip the Supabase loader
            unoptimized={!imagePath}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-5 pt-5">
        {/* <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
          {category || "Digital Product"}
        </div> */}
        <p className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-slate-900">
          {name}
        </p>
        <p className="flex items-center text-lg font-semibold text-slate-950">
          <IndianRupee width={16} className="mr-1" />
          {price}
        </p>
      </CardContent>
    </Card>
  );
}
