"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { createUserDetails } from "../lib/db/users";

export default async function UserDetailsAction(prevState, formData) {
  const session = await auth();

  const fullName = formData.get("full-name").trim();
  const firstName = fullName.split(" ")[0];
  const lastName = fullName.split(" ").slice(1).join(" ");

  const userDetails = {
    username: session?.user?.name,
    email: session?.user?.email,
    imageUrl: session?.user?.image,
    firstName,
    lastName,
    phone: formData.get("phone"),
    addressLine1: formData.get("address-line1"),
    addressLine2: formData.get("address-line2"),
    city: formData.get("city"),
    state: formData.get("state"),
    country: formData.get("country"),
    zipCode: formData.get("zip-code"),
  };

  // Insert into database
  await createUserDetails(userDetails);

  revalidatePath("/account");
  redirect("/");
}
