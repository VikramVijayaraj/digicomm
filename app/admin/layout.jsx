import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/db/users";

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if the user is an admin
  const response = await getUserByEmail(session.user.email);
  const user = response[0];

  if (!user || user.role !== "admin") {
    return notFound();
  }

  return <div className="global-padding">{children}</div>;
}
