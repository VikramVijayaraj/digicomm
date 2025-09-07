import { redirect } from "next/navigation";

import Categories from "@/components/section/categories";
import BestSelling from "@/components/section/best-selling";
import Banner from "@/components/banner/banner";
import Newsletter from "@/components/cta/newsletter";
import { auth } from "@/auth";
import { getUserByEmail, getUserSourceByEmail } from "@/lib/db/users";
import FilteredProductsPage from "./products/page";
import BannerCarousel from "@/components/banner/banner-carousel";
import EbookModal from "@/components/card/ebook-modal";
import BannerCTA from "@/components/cta/banner-cta";
import WhyChooseUs from "@/components/section/why-choose-us";
import Testimonials from "@/components/section/testimonials";

export default async function Home({ searchParams }) {
  const session = await auth();

  if (session?.user?.email) {
    const user = await getUserByEmail(session.user.email);
    const userSource = await getUserSourceByEmail(session.user.email);

    if (user.length === 0 || !userSource) {
      redirect("/info");
    }
  }

  if (searchParams?.query) {
    return <FilteredProductsPage />;
  }

  return (
    <main className="space-y-16 lg:space-y-28">
      <EbookModal loggedInUserEmail={session?.user?.email} />
      <BannerCTA />
      {/* <Banner /> */}
      {/* <BannerCarousel /> */}
      {/* <Categories /> */}
      <BestSelling />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
