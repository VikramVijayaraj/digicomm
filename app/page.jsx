import { redirect } from "next/navigation";

import Newsletter from "@/components/cta/newsletter";
import { getUserSourceByEmail } from "@/lib/db/users";
import FilteredProductsPage from "./products/page";
import BannerCTA from "@/components/cta/banner-cta";
import Testimonials from "@/components/section/testimonials";
import { createClient } from "@/utils/supabase/server";
import AllSections from "@/components/section/all-sections";

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
      <AllSections />
      <Testimonials />
      <div className="global-padding">
        <Newsletter />
      </div>
    </main>
  );
}
