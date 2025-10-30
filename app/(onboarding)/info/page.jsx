import { redirect } from "next/navigation";

import InfoForm from "./info-form";
import { getUserSourceByEmail } from "@/lib/db/users";
import { createClient } from "@/utils/supabase/server";
import { sendWelcomeEmail } from "@/actions/send-email-action";

export default async function InfoPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  // Redirect if the user has already provided their source information
  const userSource = await getUserSourceByEmail(data?.user?.email);
  if (userSource) {
    redirect("/");
  }

  async function handleNotification() {
    "use server";

    // Send welcome email
    const result = await sendWelcomeEmail(data.user.email);
    if (result.success) {
      console.log("Welcome email sent successfully");
    }

    // Notify on Slack
    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `New user signed up: *${data.user.email}*`,
      }),
    });

    if (!response.ok) {
      console.error("Cannot notify on Slack");
    }
  }

  return (
    <div className="global-padding my-20 lg:my-40 flex items-center justify-center">
      <InfoForm action={handleNotification} />
    </div>
  );
}
