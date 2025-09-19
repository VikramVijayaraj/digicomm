"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUserByEmail } from "@/lib/db/users";
import { verifyPassword } from "@/utils/password";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function signIn(values) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email.toLowerCase(),
    password: values.password,
  });

  if (error) {
    console.error(error);
    return {
      status: error.message,
      user: null,
    };
  }

  revalidatePath("/", "layout");
  return { status: "success", user: data.user };
}

export async function signUp(values) {
  const supabase = await createClient();
  const origin =
    (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_BASE_URL;

  const { data, error } = await supabase.auth.signUp({
    email: values.email.toLowerCase(),
    password: values.password,
    options: {
      data: {
        username: values.name,
      },
      emailRedirectTo: `${origin}/auth/signin`,
    },
  });

  if (error) {
    console.error(error);
    return {
      status: error.message,
      user: null,
    };
  } else if (data?.user.identities.length === 0) {
    return {
      status: "User with this email already exists. Please sign in.",
      user: null,
    };
  }

  revalidatePath("/", "layout");
  return { status: "success", user: data.user };
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin =
    (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_BASE_URL;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    redirect("/error");
  } else if (data.url) {
    redirect(data.url);
  }
}

export async function forgotPassword(email) {
  const supabase = await createClient();
  const origin =
    (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_BASE_URL;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/reset-password`,
  });

  if (error) {
    console.error("Error sending password reset email:", error.message);
    return {
      status: error.message,
    };
  }

  return { status: "success" };
}

export async function resetPassword(password, code) {
  const supabase = await createClient();
  const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);

  if (codeError) {
    console.error("Error verifying reset code:", codeError.message);
    return {
      status: codeError.message,
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Error resetting password:", error.message);
    return {
      status: error.message,
    };
  }

  revalidatePath("/", "layout");
  return { status: "success" };
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
