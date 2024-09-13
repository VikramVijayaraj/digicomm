import Image from "next/image";

export default function UserImage({ img }) {
  return (
    <div className="relative w-8 h-8">
      <Image
        className="rounded-full"
        src={img ? img : "/images/avatar.png"}
        fill
        alt="User Avatar"
      />
    </div>
  );
}
