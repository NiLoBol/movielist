import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { timeStamp } from "console";
export async function POST(request: NextRequest) {
  // อ่านข้อมูล JSON จาก body ของคำขอ
  const data = await request.json();

  // ตรวจสอบว่าได้ email และ password
  const { email, password } = data;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }
  // ที่นี่คุณสามารถบันทึกข้อมูลในฐานข้อมูลหรือทำสิ่งอื่นๆ ได้
  // ตัวอย่าง: await saveUserToDatabase({ email, hashedPassword });

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  // ดึงข้อมูลจาก Redis
  const olddata: any = await redis.get("movielist-userdata-sql");

  // ตรวจสอบว่าข้อมูลเก่ามีอยู่หรือไม่
  if (!olddata || olddata === "" || olddata === null || olddata === undefined) {
    // ถ้าไม่มีข้อมูลเก่า สร้างอาร์เรย์ใหม่และเพิ่มข้อมูลผู้ใช้
    const userdata = [];
    userdata.push({ email: email, password: password, timeStamp: Date.now() });
    await redis.set("movielist-userdata-sql", JSON.stringify(userdata));
  } else {
    // แปลงข้อมูลที่ได้จาก Redis จากสตริงเป็นอาร์เรย์
    const newdata = olddata;
    const finddata = newdata.findIndex((item: any) => {
      return item.email == email;
    });
    console.log(finddata);
    console.log(email);
    if (finddata !== -1) {
      return NextResponse.json(
        {
          message: "have User in sytem ",
        },
        { status: 201 }
      );
    } else {
      newdata.push({ email: email, password: password, timeStamp: Date.now() });
    }
    await redis.set("movielist-userdata-sql", JSON.stringify(newdata));
  }
  return NextResponse.json(
    {
      message: "User registered successfully",
    },
    { status: 201 }
  );
}


// export async function POST(request: NextRequest) {

//   return NextResponse.json(
//     {
//       message: "User registered successfully",
//     },
//     { status: 201 }
//   );
// }

// export async function GET(req: NextApiRequest) {
//   const redis = new Redis({
//     url: "https://vital-stork-57953.upstash.io",
//     token: "AeJhAAIjcDFlZDFmM2Y5ZjJlOGE0YzE1YjQ5NGQ3MjYxYmYzMTQ1YnAxMA",
//   });
//   const olddata = await redis.get("movielist-userdata-sql");
//   return Response.json({
//     massge: JSON.stringify(olddata),
//     status: 200,
//   });
// }
