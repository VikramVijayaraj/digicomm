import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

export default async function SignIn() {
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
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}