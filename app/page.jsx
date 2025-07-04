import { redirect } from "next/navigation";

import Categories from "@/components/section/categories";
import BestSelling from "@/components/section/best-selling";
import Banner from "@/components/banner/banner";
import Newsletter from "@/components/cta/newsletter";
import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/db/users";
import FilteredProductsPage from "./products/page";
import BannerCarousel from "@/components/banner/banner-carousel";
import EbookModal from "@/components/card/ebook-modal";
import BannerCTA from "@/components/cta/banner-cta";

export default async function Home({ searchParams }) {
  const session = await auth();

  if (session?.user?.email) {
    const result = await getUserByEmail(session.user.email);

    if (result.length === 0) {
      redirect("/register");
    }
  }

  if (searchParams?.query) {
    return <FilteredProductsPage />;
  }

  return (
    <main className="space-y-8 lg:space-y-16">
      <EbookModal loggedInUserEmail={session?.user?.email} />
      <BannerCTA />
      {/* <Banner /> */}
      {/* <BannerCarousel /> */}
      <Categories />
      <BestSelling />
      <Newsletter />
    </main>
  );
}
