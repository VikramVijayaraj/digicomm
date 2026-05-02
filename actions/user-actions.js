"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createUserSource,
  getUserByEmail,
  updateUserDetails,
} from "../lib/db/users";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function createUserAction(userDetails) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert([
      {
        username: userDetails.username,
        email: userDetails.email,
        password: userDetails.password,
      },
    ])
    .select("id, username, email")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error creating the user. Please try again later!");
  }

  return data;
}

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

// Guest Cart
export async function createGuestUserAction(guestDetails) {
  const supabase = await createClient();

  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id, email, username")
    .eq("email", guestDetails.email)
    .single();

  if (existingUser) {
    return existingUser;
  }

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "no rows found" which is expected
    console.error(fetchError);
    throw new Error(
      "Error checking for existing guest user. Please try again later!",
    );
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: guestDetails.email,
      user_metadata: { username: guestDetails.username, is_guest: true },
      email_confirm: true, // skip confirmation
    });

  if (authError) {
    console.error(authError);
    throw new Error("Error creating the guest user. Please try again later!");
  }

  // Create user record in users table
  const { data: newUser, error: userError } = await supabaseAdmin
    .from("users")
    // .insert([
    //   {
    //     id: authData.user.id,
    //     email: guestDetails.email,
    //     username: guestDetails.username,
    //     // phone: guestDetails.phone || null,
    //   },
    // ])
    .select("id, email, username")
    .eq("email", guestDetails.email)
    .single();

  if (userError) {
    console.error(userError);
    throw new Error(
      "Error creating guest user profile. Please try again later!",
    );
  }

  return newUser;
}
