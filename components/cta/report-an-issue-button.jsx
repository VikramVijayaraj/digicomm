"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { sendReportAnIssueEmail } from "@/actions/send-email-action";

export default function ReportAnIssueButton() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !message) {
      setIsLoading(false);
      toast.error("Please fill in all fields.");
      return;
    }

    // Send this message to contact@crelands.com
    const response = await sendReportAnIssueEmail({ email, message });
    if (response.success) {
      setEmail("");
      setMessage("");
      toast.success("Issue reported successfully!");
    } else {
      toast.error("Failed to report the issue. Please try again.");
    }

    setIsLoading(false);
  }

  return (
    <div className="fixed bottom-0 right-0 m-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" className="bg-green-600 h-14 w-14">
            <MessageCircle size="25" />
            {/* <p className="hidden md:block">Message</p> */}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="mr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="font-semibold text-center">How can we help?</p>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                name="message"
                placeholder="Describe..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
