import Image from "next/image";

export default function Banner() {
  return (
    <div className="h-[250px] lg:h-[300px] flex justify-center relative">
      <Image
        src="https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2607&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        fill
        alt=""
      />
    </div>
  );
}
