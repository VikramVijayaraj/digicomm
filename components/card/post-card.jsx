import Image from "next/image";

export default function PostCard({ title, category, image }) {
  return (
    <div
      className="h-[320px] rounded-lg cursor-pointer hover:shadow-lg transition-shadow
        duration-300 ease-in-out"
    >
      <div className="relative w-full h-[200px]">
        <Image
          src={image}
          alt="title"
          // width={100}
          // height={100}
          className="rounded-t-lg"
          fill
        />
      </div>

      <div className="space-y-2 text-center mt-2">
        <p className="text-sm opacity-70 uppercase">{category}</p>
        <h2 className="text-base lg:text-xl font-semibold">{title}</h2>
        {/* <p className="text-sm opacity-70">Post description</p> */}
      </div>
    </div>
  );
}
