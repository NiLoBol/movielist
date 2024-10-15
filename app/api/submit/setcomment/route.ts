import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(request: NextRequest) {
  const data = await request.json();

  const { email, token, id, message } = data;

  if (!email || !token || !id || !message) {
    return NextResponse.json(
      { message: "Email and token are required" },
      { status: 400 }
    );
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  const userdatalist: any = await redis.get("movie_message");
  // ดึงข้อมูลจาก Redis
  const user: any = await redis.get("movielist-userdata-sql");
  // ถ้าไม่มีข้อมูลเลย
  const usertokenIndex = user.findIndex(
    (user: { email: string }) => user.email === email
  );
  const usertokendata = user[usertokenIndex];
  const tokenx = usertokendata.timeStamp;
  const istokenMatch = await bcrypt.compare(tokenx + "", token);
  // ตรวจสอบว่า token ที่ส่งมาตรง
  if (istokenMatch) {
    // ถ้าไม่มีข้อมูลเก่า สร้างอาร์เรย์ใหม่และเพิ่มข้อมูลผู้ใช้
    if (
      !userdatalist ||
      userdatalist === "" ||
      userdatalist === null ||
      userdatalist === undefined
    ) {
      const data = [];
      data.push({
        movie_id: id,
        email,
        message,
        timestamp: new Date().toISOString(),
        id:data.length
      });
      await redis.set("movie_message", JSON.stringify(data));
    } else {
      const data = userdatalist;
      data.push({
        movie_id: id,
        email,
        message,
        timestamp: new Date().toISOString(),
        id:data[data.length-1].length
      });
      await redis.set("movie_message", JSON.stringify(data));
    }
    return NextResponse.json({ message: "success" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "token fail" }, { status: 401 });
  }
}
