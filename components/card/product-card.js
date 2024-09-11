import Image from "next/image";

export default function ProductCard({ imgUrl, name, price, description }) {
  return (
    <div className="space-y-2 py-2 hover:shadow-xl hover:shadow-gray-300 hover:scale-105 transition delay-50 duration-300 ease-in-out cursor-pointer">
      {/* Product Image */}
      <div className="relative w-full h-[400px]">
        <Image
          src={imgUrl ? imgUrl : "/images/image-avatar.svg"}
          fill
          alt=""
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Product Info */}
      <div className="p-2">
        <p>{name}</p>
        <p className="text-primary">${price}</p>
        <p>{description}</p>
      </div>
    </div>
  );
}
