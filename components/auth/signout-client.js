"use client";
import { signOut } from "next-auth/react";

export function SignOutClient() {
  return <button onClick={() => signOut()}>Sign Out</button>;
}
