import { getUserDetailsByEmail } from "@/lib/db/users";
import UserDetailsForm from "@/components/user/user-details-form";
import { createClient } from "@/utils/supabase/server";
import { UserRound } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  const result = await getUserDetailsByEmail(data.user.email);

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
            <UserRound className="h-4 w-4" />
            Account Settings
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Profile
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Manage your personal and delivery details for faster checkout.
          </p>
        </div>
      </section>

      <UserDetailsForm data={result[0]} />
    </div>
  );
}
