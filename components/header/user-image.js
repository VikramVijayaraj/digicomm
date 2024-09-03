import Image from "next/image";

export default function UserImage() {
  return (
    <div className="relative w-6 h-6">
      <Image
        className="rounded-full"
        src="/images/avatar.png"
        fill
        alt="User Avatar"
      />
    </div>
  );
}
