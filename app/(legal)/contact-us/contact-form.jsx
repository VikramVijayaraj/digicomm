"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, MapPin, MessageSquare, Send, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema } from "@/lib/schema";
import { sendContactEmail } from "@/actions/send-email-action";

const inputClassName =
  "h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values) {
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await sendContactEmail(formData);

    if (result.success) {
      toast.success("Message sent! We'll get back to you as soon as possible.");
      form.reset();
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="global-padding space-y-6 pb-10">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
            <MessageSquare className="h-4 w-4" />
            Contact Crelands
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Send us a message about orders, selling, payments, or anything else
            related to the marketplace.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="mb-6 border-b border-slate-200 pb-5">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
              <Send className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Send a message
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Share the details and we will respond as soon as possible.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            placeholder="Your name"
                            className={`${inputClassName} pl-10`}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-sm text-slate-500">
                        Please enter your full name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className={`${inputClassName} pl-10`}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-sm text-slate-500">
                        We will use this to reply to your message.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us how we can help."
                        className="min-h-48 resize-none rounded-[1.25rem] border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-slate-500">
                      Include order IDs, product links, or shop details when
                      relevant.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  className="h-12 w-full rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand sm:w-auto"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
              <Mail className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Email
            </p>
            <a
              href="mailto:contact@crelands.com"
              className="mt-2 block font-semibold text-slate-950 transition-colors hover:text-primary-brand"
            >
              contact@crelands.com
            </a>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Address
            </p>
            <div className="mt-3 space-y-4 text-sm leading-6 text-slate-600">
              <div>
                <p className="font-semibold text-slate-950">
                  Registered Address
                </p>
                <p>
                  7/221, No 2 JS Garden, Therkku chattiram, Mela valadi POST,
                  Lalgudi TALUK, Tiruchirappalli, Tamil Nadu, PIN: 621218
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">
                  Operational Address
                </p>
                <p>
                  7/221, No 2 JS Garden, Therkku chattiram, Mela valadi POST,
                  Lalgudi TALUK, Tiruchirappalli, Tamil Nadu, PIN: 621218
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_100%)] p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold text-slate-950">
              Last updated
            </p>
            <p className="mt-1 text-sm text-slate-600">
              28-10-2024 11:28:22
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
