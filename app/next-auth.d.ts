// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {

      email?: string | null;
      token?: string;
      name?: string;
      // Add any other custom fields you have
    };
  }

  interface User {

    email: string;
    token: string;
    name: string;
    // Add any other custom fields you have
  }
}
