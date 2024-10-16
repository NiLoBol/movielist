import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { Redis } from "@upstash/redis";
import { authOptions } from "@/app/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
