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

export default async function ResetPasswordPage() {
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
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
