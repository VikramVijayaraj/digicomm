import { redirect } from "next/navigation";

import { auth } from "@/auth";
import UserDetails from "@/components/user/user-details";
import { getUserDetailsByEmail } from "@/lib/db/users";

export default async function AccountPage() {
  const session = await auth();
  let result;

  if (!session?.user) {
    redirect("/signin");
  } else if (session?.user?.email) {
    result = await getUserDetailsByEmail(session.user.email);
  }

  return (
    <div className="w-[30rem] m-auto">
      <UserDetails data={result[0]} />
    </div>
  );
}
