import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const data = await request.json();

  const { email, token ,id ,message } = data;

  if (!email || !token|| !id|| !message) {
    return NextResponse.json(
      { message: "Email and token are required" },
      { status: 400 }
    );
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  
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
    const usercommentlist: any = await redis.get("movie_message");
    const findIndex = usercommentlist.findIndex((item: { email: string ,id:number}) => item.email === email && item.id===id);
    const userdata = usercommentlist;
    userdata[findIndex].message = message;
    await redis.set("movie_message",userdata);
    return NextResponse.json({ message:"success" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "token fail" }, { status: 401 });
  }
}
