"use server";

import { sql } from "@vercel/postgres";
import { Resend } from "resend";
import crypto from "crypto";

import {
  contactEmailSchema,
  orderTrackingEmailSchema,
  refundEmailSchema,
} from "@/lib/schema";

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
      from: "Crelands <contact@crelands.com>",
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
      from: "Crelands <refund@crelands.com>",
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

export async function sendResetLink(email) {
  const resetPasswordToken = crypto.randomBytes(32).toString("base64url");
  const today = new Date();
  const expiryDate = new Date(today.setDate(today.getDate() + 1)); // 24 hours

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://www.crelands.com/"
      : "http://localhost:3000";

  // Update the users table
  try {
    await sql`
      UPDATE users
      SET
        reset_password_token = ${resetPasswordToken},
        reset_password_token_expiry = ${expiryDate}
      WHERE email = ${email}
    `;

    // Send the reset link email
    await resend.emails.send({
      from: "Crelands <passwordreset@crelands.com>",
      to: email,
      subject: "Reset Password Request",
      text: `
        To reset your password, please visit:
        ${baseUrl}/auth/reset-password?token=${resetPasswordToken}
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending reset link email:", error);
    return {
      success: false,
      error: "Failed to send reset link email. Try again!",
    };
  }
}

export async function sendOrderTrackingEmail(buyerDetails, formData) {
  const result = orderTrackingEmailSchema.safeParse({
    deliveryServiceProvider: formData.get("deliveryServiceProvider"),
    trackingNumber: formData.get("trackingNumber"),
  });

  if (!result.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { deliveryServiceProvider, trackingNumber } = result.data;

  try {
    await resend.emails.send({
      from: "Crelands <orders@crelands.com>",
      to: buyerDetails.email,
      subject: "Your Order Tracking Information",
      text: `
      Dear Customer,

      We are pleased to inform you that your order has been shipped. Below are the details of your shipment:

      Product Name: ${buyerDetails.product_name}
      Delivery Service Provider: ${deliveryServiceProvider}
      Tracking Number: ${trackingNumber}

      Thank you for shopping with us. If you have any questions or need further assistance, please do not hesitate to contact our customer support.

      Best regards,
      The Crelands Team
    `,
      html: `
      <p>Dear Customer,</p>
      <p>We are pleased to inform you that your order has been shipped. Below are the details of your shipment:</p>
      <ul>
        <li><strong>Product Name:</strong> ${buyerDetails.product_name}</li>
        <li><strong>Delivery Service Provider:</strong> ${deliveryServiceProvider}</li>
        <li><strong>Tracking Number:</strong> ${trackingNumber}</li>
      </ul>
      <p>Thank you for shopping with us. If you have any questions or need further assistance, please do not hesitate to contact our customer support.</p>
      <p>Best regards,<br/>The Crelands Team</p>
    `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
