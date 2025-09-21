import { redirect } from "next/navigation";

import UserDetailsForm from "@/components/user/user-details-form";
import { createClient } from "@/utils/supabase/server";

export default async function RegisterPage({ searchParams }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <div className="global-padding w-full">
      <UserDetailsForm callbackUrl={searchParams.callback} />
    </div>
  );
}
