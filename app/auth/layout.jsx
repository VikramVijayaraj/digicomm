import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const metadata = {
  title: "Sign In",
  description: "Authentication page.",
};

export default async function AuthLayout({ children }) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return <div className="global-padding w-full">{children}</div>;
}
