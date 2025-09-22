"use server";

import { revalidatePath } from "next/cache";

import {
  createUserSource,
  getUserByEmail,
  updateUserDetails,
} from "../lib/db/users";
import { createClient } from "@/utils/supabase/server";

export async function UserDetailsAction(data) {
  const supabase = await createClient();
  const { data: loggedInUser, error } = await supabase.auth.getUser();

  if (error || !loggedInUser?.user) {
    console.error(error);
    throw new Error("Cannot fetch user data. Please try again later!");
  }

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
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.error(error);
    throw new Error("Cannot fetch user data. Please try again later!");
  }

  await createUserSource(data.user.email, source);
  revalidatePath("/info");
}
