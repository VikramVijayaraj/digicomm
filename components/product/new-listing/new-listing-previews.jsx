import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export function NewListingPreviews({ images }) {
  return (
    <div>
      {images.length > 0 && (
        <Carousel>
          <CarouselContent>
            {images.map((preview, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 h-52"
              >
                <Image
                  className="object-cover w-full h-full"
                  key={index}
                  src={preview}
                  width={200}
                  height={400}
                  alt=""
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
}
