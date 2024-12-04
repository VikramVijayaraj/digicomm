"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

export default function ContactPage() {
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
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

      <div className="flex flex-col lg:flex-row-reverse items-center">
        {/* Contact Form */}
        <div className="container px-4 py-8 max-w-md mx-auto w-full lg:w-1/2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email" {...field} />
                    </FormControl>
                    <FormDescription>
                      We&#39;ll never share your email with anyone else.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your message"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please provide details about your inquiry.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Contact Info */}
        {/* <div className="container px-4 py-8 max-w-md mx-auto text-sm w-full lg:w-1/2">
          <p className="text-gray-600">Last updated on 28-10-2024 11:28:22</p>
          <br />
          <p>You may contact us using the information below:</p>
          <br />

          <ul className="space-y-4">
            <li>
              <p>Merchant Legal Entity Name:</p>
              <p>MURUGESAN VIKRAM VIJAYARAJ</p>
            </li>
            <li>
              <p>Registered Address:</p>
              <p>
                7/221, No 2 JS Garden, Therkku chattiram, Mela valadi POST,
                Lalgudi TALUK, Tiruchirappalli, Tamil Nadu, PIN: 621218
              </p>
            </li>
            <li>
              <p>Operational Address:</p>
              <p>
                7/221, No 2 JS Garden, Therkku chattiram, Mela valadi POST,
                Lalgudi TALUK, Tiruchirappalli, Tamil Nadu, PIN: 621218
              </p>
            </li>
            <li>
              <p>Telephone No:</p>
              <p>9626119020</p>
            </li>
            <li>
              <p>E-Mail ID:</p>
              <a href="mailto:vikram31.m@gmail.com" className="hover:underline">
                vikram31.m@gmail.com
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
