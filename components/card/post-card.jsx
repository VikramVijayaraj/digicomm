import Image from "next/image";

export default function PostCard({ title, category, image }) {
  return (
    <div
      className="h-[320px] rounded-lg cursor-pointer hover:scale-105 transition delay-50
        ease-in-out"
    >
      <div className="relative w-full h-[200px]">
        <Image src={image} alt="title" className="rounded-t-lg" fill />
      </div>

      <div className="space-y-2 text-center mt-2">
        <p className="text-sm opacity-70 uppercase">{category}</p>
        <h2 className="text-base lg:text-xl font-semibold">{title}</h2>
      </div>
    </div>
  );
}
