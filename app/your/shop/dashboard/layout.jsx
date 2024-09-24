import ShopSidebar from "@/components/shop/shop-sidebar";

export const metadata = {
  title: "My Shop",
  description: "My Shop Settings.",
};

export default function ShopLayout({ children }) {
  return (
    <div className="global-padding flex min-h-screen gap-4">
      <div className="w-1/6">
        <ShopSidebar />
      </div>

      <div className="w-5/6">{children}</div>
    </div>
  );
}
