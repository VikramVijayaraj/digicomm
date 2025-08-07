import { redirect } from "next/navigation";

import { auth } from "@/auth";
import InfoForm from "./info-form";
import { getUserSourceByEmail } from "@/lib/db/users";

export default async function InfoPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Redirect if the user has already provided their source information
  const userSource = await getUserSourceByEmail(session.user.email);
  if (userSource) {
    redirect("/");
  }

  return (
    <div className="global-padding my-20 lg:my-40 flex items-center justify-center">
      <InfoForm />
    </div>
  );
}
