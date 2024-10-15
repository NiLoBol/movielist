import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  // อ่านข้อมูล JSON จาก body ของคำขอ
  const data = await request.json();

  // ตรวจสอบว่าได้ email และ password userData:{ idmovie:number , timeStamp:any }
  //   email ผ่านการ hash ดังนั้นต้องดึง user มาไล่ดูว่าใคร

  const { email, id, token } = data;

  if (!email || !id || !token) {
    return NextResponse.json(
      { message: "Email and userData are required" },
      { status: 400 }
    );
  }
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  const olddata: any = await redis.get("movie_love_list_user");
  // ดึงข้อมูลจาก Redis
  const user: any = await redis.get("movielist-userdata-sql");
  // ถ้าไม่มีข้อมูลเลย
  const usertokenIndex = user.findIndex(
    (user: { email: string }) => user.email === email
  );
  const usertokendata = user[usertokenIndex];
  const tokenx = usertokendata.timeStamp;
  const istokenMatch = await bcrypt.compare(tokenx + "", token);
  //ตรวจสอบ token ดูว่าตรงกับ user
  if (istokenMatch) {
    if (olddata === "" || olddata === null || olddata === undefined) {
      const movielist = [{ id: id, timestamp: new Date().toISOString() }];
      const userdata = [];
      const dataToStore = { email, movielist };
      userdata.push(dataToStore);
      await redis.set("movie_love_list_user", JSON.stringify(userdata));
      return NextResponse.json(
        {
          message: "setค่าใหม่แล้ว",
          olddata,
        },
        { status: 201 }
      );
    } else {
      //มีข้อมูลก็หาuserที่ต้องการ
      const userdata = olddata;
      const userindex = userdata.findIndex(
        (user: {
          email: string;
          movielist: { id: number; timeStamp: string };
        }) => user.email === email
      );
      //ถ้าไม่เจอ ก็เพิ่ม
      if (userindex == -1) {
        //ยังไม่เทส
        const movielist = [{ id: id, timestamp: new Date().toISOString() }];
        const dataToStore = { email, movielist };
        userdata.push(dataToStore);
        await redis.set("movie_love_list_user", JSON.stringify(userdata));
      } else {
        // ถ้าเจอต้องดึง ข้อมูล movielist update
        const movielist = userdata[userindex].movielist;

        const findmovie = movielist.findIndex(
          (item: { id: any; timestamp: string }) => item.id === id
        );
        if (findmovie == -1) {
          movielist.push({ id: id, timestamp: new Date().toISOString() });
          await redis.set("movie_love_list_user", JSON.stringify(userdata));
          return NextResponse.json(
            {
              message: "ตัวใหม่",
            },
            { status: 201 }
          );
        } else {
          movielist.splice(findmovie, 1);
          await redis.set("movie_love_list_user", JSON.stringify(userdata));
          return NextResponse.json(
            {
              message: "กดซ้ำ",
            },
            { status: 201 }
          );
          // ถ้าเจอมันให้ลบ
        }
      }
    }
  } else {
    return NextResponse.json(
      {
        message: "error token มีปัญหา",
      },
      { status: 201 }
    );
  }

  return NextResponse.json(
    {
      message: "ไม่มี error ",
    },
    { status: 201 }
  );
}
