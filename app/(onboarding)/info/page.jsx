import { redirect } from "next/navigation";

import InfoForm from "./info-form";
import { getUserSourceByEmail } from "@/lib/db/users";
import { createClient } from "@/utils/supabase/server";

export default async function InfoPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/signin");
  }

  // Redirect if the user has already provided their source information
  const userSource = await getUserSourceByEmail(data.user.email);
  if (userSource) {
    redirect("/");
  }

  return (
    <div className="global-padding my-20 lg:my-40 flex items-center justify-center">
      <InfoForm />
    </div>
  );
}
