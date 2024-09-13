import { redirect } from "next/navigation";

import { auth } from "@/auth";
import UserDetails from "@/components/user/user-details";

export default async function RegisterPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="w-[30rem] m-auto">
      <UserDetails />
    </div>
  );
}
