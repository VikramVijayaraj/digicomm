import { redirect } from "next/navigation";

import { auth } from "@/auth";
import UserDetailsForm from "@/components/user/user-details-form";

export default async function RegisterPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="global-padding w-full lg:flex justify-center">
      <UserDetailsForm />
    </div>
  );
}
