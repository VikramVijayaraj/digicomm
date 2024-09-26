import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCard({ imgUrl, name, price, description }) {
  return (
    <>
      <Card className="h-[550px] border-none hover:scale-105 transition delay-50 ease-in-out">
        <CardHeader className="p-0 m-0">
          <CardTitle className="relative w-full h-[400px]">
            <Image
              src={imgUrl ? imgUrl : "/images/image-avatar.svg"}
              fill
              alt=""
              style={{ objectFit: "cover" }}
              className="rounded-t-md"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-1">
          <p className="font-semibold">{name}</p>
          <p className="text-primary">${price}</p>
          <p>{description}</p>
        </CardContent>
      </Card>
    </>
  );
}
