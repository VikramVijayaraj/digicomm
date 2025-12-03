import Image from "next/image";
import { IndianRupee } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoragePath } from "@/utils/utils";

export default function ProductCard({ imgUrl, name, price, category }) {
  const imagePath = getStoragePath(imgUrl);
  const fallbackImage = "/images/image-avatar.svg";

  return (
    <>
      <Card className="border-none shadow-none hover:scale-105 transition delay-50 ease-in-out">
        <CardHeader className="p-0 m-0">
          <CardTitle className="relative w-full h-[200px] lg:h-[350px]">
            <Image
              src={imagePath || fallbackImage}
              fill
              alt={name || "Product image"}
              style={{ objectFit: "cover" }}
              className="rounded-xl"
              // Keep this: only fallback images should skip the Supabase loader
              unoptimized={!imagePath}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1 mt-1 space-y-2 text-center">
          <p className="line-clamp-1">{name}</p>
          <p className="flex items-center justify-center font-semibold">
            <IndianRupee width={16} />
            {price}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
