import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyPasswordResetToken } from "@/actions/auth-actions";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import Link from "next/link";

export default async function ResetPasswordPage({ searchParams }) {
  const invalidToken = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Invalid Token</h1>
        <p>The token provided is invalid or expired.</p>
      </div>
    </div>
  );

  if (!searchParams?.token) {
    return invalidToken;
  }

  // Check if the token exists
  const user = await verifyPasswordResetToken(searchParams?.token);

  if (!user) {
    return invalidToken;
  }

  async function handleResetSuccess(result) {
    "use server";

    // Handle the successful password reset and redirect the user to the login page
    // const result = { success: true };
    if (result.success) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Password Reset Successful</h1>
            <p>You can now sign in with your new password.</p>
            <Link
              href="/auth/signin"
              className="text-blue-500 hover:text-blue-600"
            >
              Sign In
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen">
      <Card className="w-full md:w-[400px] m-auto">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Your password should be atleast 8 characters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm
            user={user}
            token={searchParams.token}
            action={handleResetSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
