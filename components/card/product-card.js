import Image from "next/image";

export default function ProductCard() {
  return (
    <div className="space-y-2 py-2 hover:shadow-xl hover:shadow-gray-300 hover:scale-105 transition delay-50 duration-300 ease-in-out cursor-pointer">
      {/* Product Image */}
      <div className="relative w-full h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          fill
          alt=""
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Product Info */}
      <div className="p-2">
        <p>MacBook M1 Pro</p>
        <p className="text-primary">$1998</p>
        <p>Apple</p>
      </div>
    </div>
  );
}
