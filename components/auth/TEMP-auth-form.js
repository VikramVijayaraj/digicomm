"use client";

import { useFormState } from "react-dom";
import Link from "next/link";

import { auth } from "@/actions/auth-actions";
import FormLabel from "../form/form-label";
import FormInput from "../form/form-input";
import FormButton from "../form/form-button";

export default function AuthForm({ mode }) {
  const [formState, formAction] = useFormState(auth.bind(null, mode), {});
  return (
    <form className="w-1/4 mx-auto my-20" id="auth-form" action={formAction}>
      <div>
        <h1 className="text-3xl font-semibold tracking-wide mb-10 text-center">
          {mode === "login" ? "Login" : "Create your account"}
        </h1>
      </div>
      <div>
        <FormLabel>Email</FormLabel>
        <FormInput
          type="email"
          name="email"
          placeholder="Enter your email address"
        />
      </div>
      <div>
        <FormLabel>Password</FormLabel>
        <FormInput
          type="password"
          name="password"
          placeholder="Enter your password"
        />
      </div>
      {mode === "signup" && (
        <div>
          <FormLabel>Re-enter password</FormLabel>
          <FormInput
            type="password"
            name="rePassword"
            placeholder="Enter your password again"
          />
        </div>
      )}
      {formState.errors && (
        <ul id="form-errors">
          {Object.keys(formState.errors).map((error) => (
            <li className="text-red-500" key={error}>
              {formState.errors[error]}
            </li>
          ))}
        </ul>
      )}
      <p>
        <FormButton type="submit">
          {mode === "login" ? "Login" : "Create Account"}
        </FormButton>
      </p>
      <p className="text-center my-2 underline">
        {mode === "login" && (
          <Link href="authenticate/?mode=signup">Create an account</Link>
        )}
        {mode === "signup" && (
          <Link href="authenticate/?mode=login">
            Login with existing account
          </Link>
        )}
        {mode === "account" && <Link>Make an account</Link>}
      </p>
    </form>
  );
}
