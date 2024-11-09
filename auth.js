import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";

import { signInSchema, signUpSchema } from "./lib/schema";
import { getUserIfExists } from "./actions/auth-actions";
import { createUserAction } from "./actions/user-actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
        name: {}, // For sign-up
      },
      authorize: async (credentials) => {
        try {
          let userCredentials;

          if (!credentials.name || credentials.name === "undefined") {
            userCredentials = await signInSchema.parseAsync(credentials);
          } else {
            userCredentials = await signUpSchema.parseAsync(credentials);
          }

          const { email, password } = userCredentials;

          // logic to verify if the user exists
          let user = null;

          if (!credentials.name || credentials.name === "undefined") {
            user = await getUserIfExists(email, password);
          } else {
            const { name } = userCredentials;
            user = await createUserAction({ name, email, password });
          }

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
});
