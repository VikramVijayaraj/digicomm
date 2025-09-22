import { getUserDetailsByEmail } from "@/lib/db/users";
import UserDetailsForm from "@/components/user/user-details-form";
import { createClient } from "@/utils/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/signin");
  }

  const result = await getUserDetailsByEmail(data.user.email);

  return (
    <div className="">
      <UserDetailsForm data={result[0]} />
    </div>
  );
}
