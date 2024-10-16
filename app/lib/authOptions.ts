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
  
          // สร้างการเชื่อมต่อกับ Redis
          const redis = new Redis({
            url: process.env.UPSTASH_REDIS_URL!,
            token: process.env.UPSTASH_REDIS_TOKEN!,
          });
  
          // ดึงข้อมูลจาก Redis
          const data: any = await redis.get("movielist-userdata-sql");
  
          // ตรวจสอบว่า data เป็น array และมีข้อมูล
          if (!Array.isArray(data) || data.length === 0) {
            return null;
          }
  
          // หา index ของผู้ใช้ที่มี email ตรงกับที่กรอกเข้ามา
          const findIndex = data.findIndex((item: any) => {
            return item.email === credentials.email;
          });
  
          // ถ้าไม่พบผู้ใช้ให้คืนค่า null
          if (findIndex === -1) {
            return null;
          }
  
          const hashedPassword = data[findIndex].password;
          // ตรวจสอบ password โดยใช้ bcrypt แบบอะซิงโครนัส
          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            hashedPassword
          );
          const timeStampString = String(data[findIndex].timeStamp); // แปลงเป็นสตริง
          const token = bcrypt.hashSync(timeStampString, 10);
  
          // ถ้า password ตรงกัน ให้คืนค่าข้อมูลผู้ใช้
          if (isPasswordMatch) {
            return {
              id: data[findIndex].timeStamp,
              email: data[findIndex].email,
              name: token,
            };
          }
  
          // คืนค่า null ถ้า password ไม่ตรงกัน
          return null;
        },
      }),
    ],
  
    // Other options like callbacks can go here if needed
  };
  