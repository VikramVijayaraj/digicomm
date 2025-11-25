import Image from "next/image";

export function NewProductPreviews({ images }) {
  return (
    <div className="flex overflow-x-scroll gap-4">
      {images?.length > 0 &&
        images.map((image, index) => (
          <div key={index} className="relative h-52 w-44 flex-shrink-0">
            <Image src={image} alt="" fill unoptimized={true} />
          </div>
        ))}
    </div>
  );
}
