import Image from "next/image";
import { IndianRupee } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCard({ imgUrl, name, price, category }) {
  return (
    <>
      <Card
        className="h-[400px] lg:h-[500px] border-none shadow-none hover:scale-105 transition
          delay-50 ease-in-out"
      >
        <CardHeader className="p-0 m-0">
          <CardTitle className="relative w-full h-[300px] lg:h-[400px]">
            <Image
              src={imgUrl ? imgUrl : "/images/image-avatar.svg"}
              fill
              alt=""
              style={{ objectFit: "cover" }}
              className="rounded-xl"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1 mt-1 space-y-2 text-center">
          <p className="line-clamp-1">{name}</p>
          <p className="flex items-center justify-center font-semibold">
            <IndianRupee width={16} />
            {price}
          </p>
          {/* <p className="text-sm opacity-70">{category}</p> */}
        </CardContent>
      </Card>
    </>
  );
}
