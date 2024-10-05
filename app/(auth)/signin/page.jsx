import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignIn() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="global-padding text-center min-h-screen">
      <Card className="w-1/2 m-auto space-y-8 h-52">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
            className=""
          >
            <Button type="submit">Sign in with Google</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
