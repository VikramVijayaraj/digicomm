"use client";

import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { heroBanners } from "@/lib/data";

export default function Banner() {
  const plugin = React.useRef(Autoplay({ delay: 3000, loop: true }));

  return (
    <div className="w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {heroBanners.map((image) => (
            <CarouselItem key={image.id}>
              <Card className="border-0 rounded-none">
                <CardContent className="p-0">
                  <div className="relative w-full aspect-[21/9] md:aspect-[28/9] lg:aspect-[35/9]">
                    <Image
                      src={image.src}
                      fill
                      alt="Banner Image"
                      className="object-fill"
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
          {/* Add more CarouselItems here for additional banner images */}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

/* <div className="h-[250px] lg:h-[300px] flex justify-center relative">
<Image
  src="https://firebasestorage.googleapis.com/v0/b/digicomm-cbe9b.appspot.com/o/hero-section%2Fe-books-banner-comp.png?alt=media&token=cea337f0-2de1-48ab-8813-e122b7a235eb"
  fill
  alt="Banner Image"
/> */

/* <Image
        src="https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2607&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        fill
        alt=""
      /> */

// </div>
//   );
// }
