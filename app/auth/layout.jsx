import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function AuthLayout({ children }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
  }

  if (data?.user) {
    redirect("/");
  }

  return <div className="global-padding w-full">{children}</div>;
}
