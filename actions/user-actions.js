"use server";

import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";

import { auth } from "@/auth";
import {
  createUser,
  createUserDetails,
  createUserSource,
  getUserByEmail,
  updateUserDetails,
} from "../lib/db/users";
import { saltAndHashPassword } from "@/utils/password";
import { sendWelcomeEmail } from "./send-email-action";

const sql = neon(process.env.DATABASE_URL);

export async function createUserAction(userData) {
  const { name, email, password } = userData;
  const hashedPassword = await saltAndHashPassword(password);

  const userDetails = {
    username: name,
    email,
    password: hashedPassword,
    // source,
  };
  const user = await createUser(userDetails);

  revalidatePath("/");
  return user;
}

export async function UserDetailsAction(data = null, source = null) {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);

  const baseUserDetails = {
    username: session?.user?.name || user[0]?.username,
    email: session?.user?.email || user[0]?.email,
    imageUrl: session?.user?.image || user[0]?.image_url,
  };

  // 🧠 If `data` is provided
  if (data) {
    const fullName = data.name.trim();
    const firstName = fullName.split(" ")[0];
    const lastName = fullName.split(" ").slice(1).join(" ");

    const userDetails = {
      ...baseUserDetails,
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

    const user = await getUserByEmail(userDetails.email);

    if (user.length > 0) {
      await updateUserDetails(userDetails);
    } else {
      await createUserDetails(userDetails);
    }

    revalidatePath("/");
  }

  // 🧠 If `source` is provided
  if (source) {
    const email = baseUserDetails.email;
    const username = baseUserDetails.username;
    const imageUrl = baseUserDetails.imageUrl;

    try {
      await sql`
        INSERT INTO users (email, username, image_url, source)
        VALUES (${email}, ${username}, ${imageUrl}, ${source})
        ON CONFLICT (email) DO UPDATE SET source = EXCLUDED.source;
    `;
    } catch (error) {
      console.error(error);
      throw new Error(
        "Error updating the user source. Please try again later!",
      );
    }
  }

  await sendWelcomeEmail(baseUserDetails.email);
}

// export async function UserDetailsAction(data) {
//   const session = await auth();

//   const fullName = data.name.trim();
//   const firstName = fullName.split(" ")[0];
//   const lastName = fullName.split(" ").slice(1).join(" ");

//   const userDetails = {
//     username: session?.user?.name,
//     email: session?.user?.email,
//     imageUrl: session?.user?.image,
//     firstName,
//     lastName,
//     phone: data.phone,
//     addressLine1: data.address1,
//     addressLine2: data.address2,
//     city: data.city,
//     state: data.state,
//     country: data.country,
//     zipCode: data.zipCode,
//   };

//   // Insert or Update by checking the user
//   const user = await getUserByEmail(userDetails.email);

//   if (user.length > 0) {
//     await updateUserDetails(userDetails);
//   } else {
//     await createUserDetails(userDetails);
//   }

//   revalidatePath("/");
//   // redirect("/your/account");
// }

export async function getUserByEmailAction(email) {
  const user = await getUserByEmail(email);
  return user[0];
}

// export async function createUserSourceAction(source) {
//   await createUserSource(email, source);
//   revalidatePath("/");
// }
