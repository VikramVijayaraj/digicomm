"use server";

import { Resend } from "resend";

import { contactEmailSchema, refundEmailSchema } from "@/lib/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData) {
  const result = contactEmailSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!result.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { name, email, message } = result.data;

  try {
    await resend.emails.send({
      from: "DigiComm <onboarding@resend.dev>",
      to: "vikramvijayaraj31@gmail.com", // Replace with your email
      subject: "New Contact Form Submission",
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendRefundEmail(formData) {
  const result = refundEmailSchema.safeParse({
    email: formData.get("email"),
    orderItemId: formData.get("orderItemId"),
  });

  if (!result.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { email, orderItemId } = result.data;

  try {
    await resend.emails.send({
      from: "DigiComm <onboarding@resend.dev>",
      to: "vikramvijayaraj31@gmail.com", // Replace with your email
      subject: "New Refund Request",
      text: `
        User Email: ${email}
        Order Item Id: ${orderItemId}
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
