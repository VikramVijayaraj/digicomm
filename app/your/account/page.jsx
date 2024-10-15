import { auth } from "@/auth";
import { getUserDetailsByEmail } from "@/lib/db/users";
import UserDetailsForm from "@/components/user/user-details-form";

export default async function AccountPage() {
  const session = await auth();
  let result;

  if (session?.user?.email) {
    result = await getUserDetailsByEmail(session.user.email);
  }

  return (
    <div className="w-full lg:w-[80%]">
      <UserDetailsForm data={result[0]} />
    </div>
  );
}
