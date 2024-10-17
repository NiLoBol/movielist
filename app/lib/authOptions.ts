import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { Redis } from "@upstash/redis";

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "email", type: "text" },
          password: { label: "password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) {
            return null;
          }
          const { email, password  } = credentials;
          // ตรวจสอบผู้ใช้จากฐานข้อมูลหรือ Redis
          
  
          // const redis = new Redis({
          //   url: process.env.UPSTASH_REDIS_URL!,
          //   token: process.env.UPSTASH_REDIS_TOKEN!,
          // });
  
          // const data: any = await redis.get("movielist-userdata-sql");
  
          // if (!Array.isArray(data) || data.length === 0) {
          //   return null;
          // }
  
          // // หา index ของผู้ใช้ที่มี email ตรงกับที่กรอกเข้ามา
          // const findIndex = data.findIndex((item: any) => {
          //   return item.email === credentials.email;
          // });
  
          // // ถ้าไม่พบผู้ใช้ให้คืนค่า null
          // if (findIndex === -1) {
          //   return null;
          // }
  
          // const hashedPassword = data[findIndex].password;
          // // ตรวจสอบ password โดยใช้ bcrypt แบบอะซิงโครนัส
          // const isPasswordMatch = await bcrypt.compare(
          //   credentials.password,
          //   hashedPassword
          // );
          // const timeStampString = String(data[findIndex].timeStamp); // แปลงเป็นสตริง
          // const token = bcrypt.hashSync(timeStampString, 10);
  
          // // ถ้า password ตรงกัน ให้คืนค่าข้อมูลผู้ใช้
          // if (isPasswordMatch) {
          //   return {
          //     id: data[findIndex].timeStamp,
          //     email: data[findIndex].email,
          //     name: token,
          //     token:token
          //   };
          // }
  
          // คืนค่า null ถ้า password ไม่ตรงกัน
          return null;
        },
      }),
    ],

    callbacks: {
        async session({ session, token }) {
          // Customize the session object here based on the token values
          session.user = {
             // Assume id is always string
            email: token.email || null, // Use token.email or set it to null if undefined
            token: token.token as string || undefined, // Use token.token or set it to undefined if not present
            name:token.name || undefined
          };
    
          return session;
        },
        async jwt({ token, user }) {
          // Customize the JWT to store extra information if needed
          if (user) {
             // Save user ID to the token
            token.email = user.email; // Save email to the token
            token.token = user.token; // Save the custom token to the token
            token.name = user.name;
          }
    
          return token;
        },
      },
  
    // Other options like callbacks can go here if needed
  };
  