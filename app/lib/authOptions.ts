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
          return null; // หากไม่มีข้อมูลรับรอง ให้คืนค่า null
        }
        
        const { email, password } = credentials;

        // ตรวจสอบว่ามีอีเมลและรหัสผ่านหรือไม่
        if (!email || !password) {
          return null; // คืนค่า null หากไม่มีข้อมูลที่จำเป็น
        }

        const redis = new Redis({
          url: process.env.UPSTASH_REDIS_URL!,
          token: process.env.UPSTASH_REDIS_TOKEN!,
        });

        const data: any = await redis.get("movielist-userdata-sql");

        // ตรวจสอบข้อมูลที่ได้จาก Redis
        if (!Array.isArray(data) || data.length === 0) {
          return null; // คืนค่า null หากข้อมูลผู้ใช้ไม่มี
        }

        const findIndex = data.findIndex((item: any) => {
          return item.email === email; // หาผู้ใช้ที่มีอีเมลตรงกัน
        });

        if (findIndex === -1) {
          return null; // คืนค่า null หากไม่พบผู้ใช้
        }
        console.log(data[findIndex]);
        const users :any ={
          id: data[findIndex].timeStamp,
          email: data[findIndex].email,
          name: data[findIndex].username,
        }
                //  else {
        //   const users: any = {
        //   id: findIndex,
        //   email: "have index",
        //   name: "Test User",
        //   token: "example-token",
        //   password: bcrypt.hashSync("password", 10), // รหัสผ่านที่เข้ารหัส
        // };
        //   return users;
        // }

        const hashedPassword = data[findIndex].password;
        console.log(password+"  "+hashedPassword);
     
        // ตรวจสอบรหัสผ่าน
        const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
        const timeStampString = String(data[findIndex].timeStamp);
        const token = bcrypt.hashSync(timeStampString, 10);
        console.log(isPasswordMatch);
        
        if (isPasswordMatch) {
          return {
            id: data[findIndex].timeStamp,
            email: data[findIndex].email,
            name: token,
            token: token,
          };
        } else {
          return null;
        }
        return null; // คืนค่า null หากรหัสผ่านไม่ตรงกัน
      },
    }),
  ],
  // callbacks: {
  //     async session({ session, token }) {
  //       // Customize the session object here based on the token values
  //       session.user = {
  //          // Assume id is always string
  //         email: token.email || null, // Use token.email or set it to null if undefined
  //         token: token.token as string || undefined, // Use token.token or set it to undefined if not present
  //         name:token.name || undefined
  //       };

  //       return session;
  //     },
  //     async jwt({ token, user }) {
  //       // Customize the JWT to store extra information if needed
  //       if (user) {
  //          // Save user ID to the token
  //         token.email = user.email; // Save email to the token
  //         token.token = user.token; // Save the custom token to the token
  //         token.name = user.name;
  //       }

  //       return token;
  //     },
  //   },

  // Other options like callbacks can go here if needed
};
