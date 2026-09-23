import { redirect } from "next/navigation";

import OnboardingWizard from "@/components/onboarding/onboarding-wizard";
import { getOnboardingStatus } from "@/lib/db/users";
import { getCategories } from "@/lib/db/categories";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Welcome",
  description: "Set up your Crelands account",
};

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  // Check if onboarding is already completed
  const status = await getOnboardingStatus(data.user.email);
  if (status?.onboarding_completed) {
    redirect("/");
  }

  // Fetch categories for the product listing step (seller path)
  const categories = await getCategories();

  return (
    <div className="global-padding pb-10">
      <OnboardingWizard session={data} categories={categories} />
    </div>
  );
}
