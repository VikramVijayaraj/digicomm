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
    <div className="w-full min-w-0 max-w-full overflow-x-auto pb-1 scrollbar-thin">
      <div className="flex w-max gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative h-48 w-40 shrink-0 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-xs"
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
    </div>
  );
}
