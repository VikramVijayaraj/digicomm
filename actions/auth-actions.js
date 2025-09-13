"use server";

// import { sql } from "@vercel/postgres";
import { neon } from "@neondatabase/serverless";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// import { signIn, signOut } from "@/auth";
import { getUserByEmail } from "@/lib/db/users";
import { saltAndHashPassword, verifyPassword } from "@/utils/password";
import { createClient } from "@/utils/supabase/server";

const sql = neon(process.env.DATABASE_URL);

export async function signin(values) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: values.email.toLowerCase(),
    password: values.password,
  };

  const { data: user, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error.message);
  }

  console.log(user);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(values) {
  const { email, password, name } = values;

  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: email.toLowerCase(),
    password: password,
  };

  const { data: user, error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
  }

  console.log(user);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// export async function handleCredentialsSignIn(
//   { email, password, name },
//   callbackUrl,
// ) {
//   try {
//     await signIn("credentials", {
//       email,
//       password,
//       name,
//       // source,
//       redirectTo: callbackUrl,
//     });
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return {
//             message: "Invalid email or password",
//           };
//         default:
//           return {
//             message: "An unexpected error occurred",
//           };
//       }
//     }
//     throw error;
//   }
//   revalidatePath("/");
// }

// export async function handleSignOut() {
//   await signOut();
//   revalidatePath("/");
// }

export async function getUserIfExists(email, password) {
  // Logic to check if the user exists in the database and matches the hashed password
  email = email.toLowerCase();
  const user = await getUserByEmail(email);
  if (user.length === 0) {
    return null;
  }

  const isPasswordMatch = await verifyPassword(password, user[0]?.password);
  if (isPasswordMatch) {
    return user[0];
  }
  return null;
}

export async function verifyPasswordResetToken(token) {
  try {
    const rows = await sql`
    SELECT * FROM users
    WHERE reset_password_token = ${token};
  `;
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error(
      "Error verifying the password reset token. Please try again later!",
    );
  }
}

export async function updatePassword(email, plainPassword) {
  try {
    const hashedPassword = await saltAndHashPassword(plainPassword);

    await sql`
      UPDATE users
      SET
        password = ${hashedPassword},
        reset_password_token = null,
        reset_password_token_expiry = null
      WHERE email = ${email};
    `;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to update the password. Please try again later!",
    };
  }
}
