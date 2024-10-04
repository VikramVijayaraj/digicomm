import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function SignIn({ searchParams }) {
  console.log(searchParams);
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
      className="text-center min-h-screen"
    >
      <Button type="submit">Signin with Google</Button>
    </form>
  );
}
