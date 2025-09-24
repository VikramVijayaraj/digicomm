import { notFound, redirect } from "next/navigation";

import { getUserByEmail } from "@/lib/db/users";
import { createClient } from "@/utils/supabase/server";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
  }

  if (!data?.user) {
    redirect("/auth/signin");
  }

  // Check if the user is an admin
  const response = await getUserByEmail(data?.user.email);
  const user = response[0];

  if (!user || user.role !== "admin") {
    return notFound();
  }

  return <div className="global-padding">{children}</div>;
}
