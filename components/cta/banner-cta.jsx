import Link from "next/link";

export default function BannerCTA() {
  return (
    <div
      className="bg-[url(https://images.unsplash.com/photo-1698807390276-725f3a7e41cf?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]
        h-[500px] bg-cover"
    >
      <div className="flex flex-col items-center justify-center h-full bg-black/50">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Launch Your Digital Store Today
        </h2>
        <p className="text-lg md:text-xl text-white mb-6">
          Turn your ideas into income. Start selling digital products in minutes
          - no tech skills needed.
        </p>
        <Link
          href="/your/shop/dashboard"
          className="bg-primary-brand font-semibold text-white px-6 py-3 rounded-lg hover:bg-black
            transition-colors"
        >
          Start Your Store
        </Link>
      </div>
    </div>
  );
}
