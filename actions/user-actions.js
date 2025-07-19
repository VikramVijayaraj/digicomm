"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createUser,
  createUserDetails,
  getUserByEmail,
  updateUserDetails,
} from "../lib/db/users";
import { saltAndHashPassword } from "@/utils/password";

export async function createUserAction(userData) {
  const { name, email, password, source } = userData;
  const hashedPassword = await saltAndHashPassword(password);

  const userDetails = {
    username: name,
    email,
    password: hashedPassword,
    source,
  };
  const user = await createUser(userDetails);

  revalidatePath("/");
  return user;
}

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

  revalidatePath("/");
  // redirect("/your/account");
}

export async function getUserByEmailAction(email) {
  const user = await getUserByEmail(email);
  return user[0];
}
