import Image from "next/image";

import { getStoragePath } from "@/utils/utils";

export default function PostCard({ title, category, image }) {
  const imagePath = getStoragePath(image);
  return (
    <div
      className="rounded-lg cursor-pointer hover:scale-105 transition delay-50
        ease-in-out"
    >
      <div className="relative w-full h-[200px]">
        <Image src={imagePath} alt={title} className="rounded-t-lg" fill />
      </div>

      <div className="space-y-2 text-center mt-2">
        <p className="text-sm opacity-70 uppercase">{category}</p>
        <h2 className="text-base lg:text-xl font-semibold">{title}</h2>
      </div>
    </div>
  );
}
