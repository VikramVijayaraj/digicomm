"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// Sample banner data
const bannerItems = [
  {
    id: 1,
    imageUrl: "/images/shop-banner-default.jpg",
    alt: "Banner 2",
  },
  {
    id: 2,
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/digicomm-cbe9b.appspot.com/o/hero-section%2Fe-books-banner-comp.png?alt=media&token=cea337f0-2de1-48ab-8813-e122b7a235eb",
    alt: "Banner 1",
  },

  // {
  //   id: 2,
  //   imageUrl:
  //     "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2607&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   alt: "Banner 2",
  // },
  // { id: 3, imageUrl: '/placeholder.svg?height=600&width=1200', alt: 'Banner 3' },
];

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % bannerItems.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Carousel className="w-full max-w-6xl mx-auto">
      <CarouselContent>
        {bannerItems.map((item, index) => (
          <CarouselItem key={item.id} className="relative">
            <Card className="border-0">
              <CardContent className="p-0">
                <Image
                  src={item.imageUrl}
                  alt={item.alt}
                  width={1200} 
                  height={600}
                  className={cn(
                    "w-full h-auto object-cover transition-opacity duration-500",
                    index === activeIndex ? "opacity-100" : "opacity-0",
                  )}
                  priority={index === 0}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
