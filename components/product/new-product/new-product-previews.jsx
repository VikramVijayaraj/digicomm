import Image from "next/image";

export function NewProductPreviews({ images }) {
  if (!images?.length) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
        Image previews will appear here after you upload them.
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
      {images?.length > 0 &&
        images.map((image, index) => (
          <div
            key={index}
            className="relative h-48 w-40 flex-shrink-0 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm"
          >
            <Image
              src={image}
              alt=""
              fill
              unoptimized={true}
              className="object-cover"
            />
          </div>
        ))}
    </div>
  );
}
