import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const data = await request.json();

  const { email, token } = data;

  if (!email || !token) {
    return NextResponse.json(
      { message: "Email and token are required" },
      { status: 400 }
    );
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  const userdatalist: any = await redis.get("movie_love_list_user");
  // ดึงข้อมูลจาก Redis
  const user: any = await redis.get("movielist-userdata-sql");
  // ถ้าไม่มีข้อมูลเลย
  const usertokenIndex = user.findIndex(
    (user: { email: string }) => user.email === email
  );
  const usertokendata = user[usertokenIndex];
  const tokenx = usertokendata.timeStamp;
  const istokenMatch = await bcrypt.compare(tokenx + "", token);
  if (istokenMatch) {
    const index = userdatalist.findIndex((item: { email: string }) => item.email === email);
    const userdata = userdatalist[index].movielist;
    return NextResponse.json({ message: "get user", userdata }, { status: 200 });
  } else {
    return NextResponse.json({ message: "token fail" }, { status: 401 });
  }
}
