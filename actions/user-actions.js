"use server";

import { revalidatePath } from "next/cache";

import {
  createUserSource,
  getUserByEmail,
  updateUserDetails,
} from "../lib/db/users";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function UserDetailsAction(data) {
  const supabase = await createClient();
  const { data: loggedInUser } = await supabase.auth.getUser();

  const fullName = data.name.trim();
  const firstName = fullName.split(" ")[0];
  const lastName = fullName.split(" ").slice(1).join(" ");

  const userDetails = {
    email: loggedInUser.user.email,
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

  await updateUserDetails(userDetails);
  revalidatePath("/");
}

export async function getUserByEmailAction(email) {
  const user = await getUserByEmail(email);
  return user[0];
}

export async function createUserSourceAction(source) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  await createUserSource(data.user.email, source);
  revalidatePath("/info");
}
