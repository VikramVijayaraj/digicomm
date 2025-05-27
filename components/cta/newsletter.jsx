"use client";

import { getLeadAction, storeLeadAction } from "@/actions/lead-actions";
import { isValidEmail } from "@/utils/utils";
import { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    // Validate email format
    const validEmail = isValidEmail(email);
    if (!validEmail) {
      toast.error("Please enter a valid email address");
      return;
    }

    const emailExists = await getLeadAction(email);
    if (emailExists) {
      toast.info("You are already subscribed to our newsletter.");
      return;
    }

    try {
      // Store the email in db
      await storeLeadAction(email);

      setEmail("");
      toast.success("Thank you for subscribing to our newsletter!");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Failed to subscribe. Please try again later.");
    }
  }

  return (
    <div className="global-padding bg-sky-200 py-10 flex flex-col items-center space-y-4">
      <p className="text-center font-semibold">
        Subscibe to get exclusive offers, and personalised tips for shopping and
        selling on {process.env.NEXT_PUBLIC_APP_NAME}.
      </p>

      {/* User Input */}
      <form className="flex w-full md:justify-center">
        <input
          className="w-full md:w-96 p-4 rounded-l-full bg-white"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          onClick={handleSubmit}
          className="bg-white p-4 rounded-r-full hover:bg-black hover:text-white"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
