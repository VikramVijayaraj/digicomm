"use client";

import { useFormStatus } from "react-dom";

export default function FormButton({ children, type }) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type={type}
      className="bg-primary text-white p-3 text-center w-full text-xl rounded-sm cursor-pointer hover:bg-primary-dark"
    >
      {pending ? "Saving..." : children}
    </button>
  );
}
