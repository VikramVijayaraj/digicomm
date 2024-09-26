"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  createUserDetails,
  getUserByEmail,
  updateUserDetails,
} from "../lib/db/users";
import { redirect } from "next/navigation";

export async function UserDetailsAction(data) {
  const session = await auth();

  const fullName = data.name.trim();
  const firstName = fullName.split(" ")[0];
  const lastName = fullName.split(" ").slice(1).join(" ");

  const userDetails = {
    username: session?.user?.name,
    email: session?.user?.email,
    imageUrl: session?.user?.image,
    firstName,
    lastName,
    phone: data.phone,
    addressLine1: data.address1,
    addressLine2: data.address2,
    city: data.city,
    state: data.state,
    country: data.country,
    zipCode: data.zipCode,
  };

  // Insert or Update by checking the user
  const user = await getUserByEmail(userDetails.email);

  if (user.length > 0) {
    await updateUserDetails(userDetails);
  } else {
    await createUserDetails(userDetails);
  }

  revalidatePath("/your/account");
  redirect("/your/account");
}
