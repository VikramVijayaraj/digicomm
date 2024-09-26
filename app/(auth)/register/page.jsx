import { redirect } from "next/navigation";

import { auth } from "@/auth";
import UserDetailsForm from "@/components/user/user-details-form";

export default async function RegisterPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="w-[30rem] m-auto">
    <h2 className="text-2xl font-semibold text-center">Register</h2>
      <UserDetailsForm />
    </div>
  );
}
