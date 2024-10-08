"use server";

import { redirect } from "next/navigation";

import { hashUserPassword, verifyPassword } from "@/lib/TEMP-auth/hash";
import { createUser, getUserByEmail } from "@/lib/TEMP-auth/user";
import { createAuthSession, destroySession } from "@/lib/TEMP-auth/auth";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const rePassword = formData.get("rePassword");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be atleast 8 characters long.";
  }

  if (password !== rePassword) {
    errors.rePassword = "Both passwords must match.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors: errors,
    };
  }

  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, hashedPassword);
    await createAuthSession(id);
    redirect("/account");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "It seems an account already exists with the given email id.",
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: "Could not authenticate user, please check your credentials.",
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        password: "Could not authenticate user, please check your credentials.",
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect("/account");
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

export async function logout() {
  await destroySession();
  redirect("/");
}
