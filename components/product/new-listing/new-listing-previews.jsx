import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function NewListingPreviews({ images }) {
  return (
    <div>
      {images.length > 0 && (
        <Carousel>
          <CarouselContent>
            {images.map((preview, index) => (
              <CarouselItem className="md:basis-1/2 lg:basis-1/3 h-52">
                <img
                  className="object-cover w-full h-full"
                  key={index}
                  src={preview}
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
