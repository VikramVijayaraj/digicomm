import { redirect } from "next/navigation";

import Categories from "@/components/section/categories";
import BestSelling from "@/components/section/best-selling";
import Banner from "@/components/banner/banner";
import Newsletter from "@/components/cta/newsletter";
import { getUserByEmail, getUserSourceByEmail } from "@/lib/db/users";
import FilteredProductsPage from "./products/page";
import BannerCarousel from "@/components/banner/banner-carousel";
import EbookModal from "@/components/card/ebook-modal";
import BannerCTA from "@/components/cta/banner-cta";
import WhyChooseUs from "@/components/section/why-choose-us";
import Testimonials from "@/components/section/testimonials";
import { createClient } from "@/utils/supabase/server";

export default async function Home({ searchParams }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user?.email) {
    // const user = await getUserByEmail(data.user.email);
    const userSource = await getUserSourceByEmail(data.user.email);

    if (!userSource) {
      redirect("/info");
    }
  }

  if (searchParams?.query) {
    return <FilteredProductsPage />;
  }

  return (
    <main className="space-y-16 lg:space-y-28">
      {/* <EbookModal loggedInUserEmail={data?.user?.email} /> */}
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
