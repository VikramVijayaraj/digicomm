import { redirect } from "next/navigation";

import Newsletter from "@/components/cta/newsletter";
import { getUserSourceByEmail } from "@/lib/db/users";
import { getOnboardingStatus } from "@/lib/db/users";
import FilteredProductsPage from "./products/page";
import BannerCTA from "@/components/cta/banner-cta";
import { createClient } from "@/utils/supabase/server";
import AllSections from "@/components/section/all-sections";
import WhatsAppSupportBanner from "@/components/cta/whatsapp-support-banner";

export default async function Home(props) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user?.email) {
    const status = await getOnboardingStatus(data.user.email);

    // Only redirect if we got a valid response AND onboarding is explicitly not completed.
    // If status is null (query error, column missing), let the user through.
    if (status && status.onboarding_completed === false) {
      redirect("/welcome");
    }
  }

  if (searchParams?.query) {
    return (
      <FilteredProductsPage searchParams={Promise.resolve(searchParams)} />
    );
  }

  return (
    <main className="space-y-16 lg:space-y-28">
      {/* <EbookModal loggedInUserEmail={data?.user?.email} /> */}
      <BannerCTA />
      {/* <Banner /> */}
      {/* <BannerCarousel /> */}
      {/* <Categories /> */}
      <AllSections />
      <WhatsAppSupportBanner />
      <div className="global-padding">
        <Newsletter />
      </div>
    </main>
  );
}
