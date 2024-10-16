import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const data = await request.json();

  const { email, token ,id  } = data;

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
    const filter = usercommentlist.filter((item: { email: string ,id:number}) => item.id!==id);
    await redis.set("movie_message",filter);

    return NextResponse.json({ message:"success"  }, { status: 200 });
  } else {
    return NextResponse.json({ message: "token fail" }, { status: 401 });
  }
}
