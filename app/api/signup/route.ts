import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { timeStamp } from "console";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/db";
import User from "@/model/User";
interface CustomError extends Error {
  code?: number;
}


export async function POST(request: NextRequest) {
    const data = await request.json();
    const { email, password, fullname, gender, phonenumber, username } = data;

    try {
        await connectMongoDB();
    } catch (error) {
        return NextResponse.json(
            { message: "Database connection failed" },
            { status: 500 }
        );
    }

    if (!email || !password || !fullname || !gender || !phonenumber || !username) {
        return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
        );
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return NextResponse.json(
            { message: "Invalid email format" },
            { status: 400 }
        );
    }

    // ตรวจสอบความยาวหมายเลขโทรศัพท์
    if (phonenumber.length !== 10) {
        return NextResponse.json(
            { message: "Phone number must be 10 digits" },
            { status: 400 }
        );
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        email,
        password: hashedPassword,
        fullname,
        gender,
        phonenumber,
        username,
        timeStamp: Date.now(),
    });

    try {
        await newUser.save();
    } catch (error) {
      const customError = error as CustomError;
        if (customError.code === 11000) {
          const existingUser = await User.findOne({ email },{ email: 1, fullname: 1 ,_id:0});
            return NextResponse.json(
                { message: "Email already exists.",existingUser },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "An error occurred while registering." },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            message: "User registered successfully",
        },
        { status: 201 }
    );
}




// export async function POST(request: NextRequest) {
//   const data = await request.json();
//   const { email, password, fullname, gender, phonenumber, username } = data;

//   await connectMongoDB();

//   if (
//     !email ||
//     !password ||
//     !fullname ||
//     !gender ||
//     !phonenumber ||
//     !username
//   ) {
//     return NextResponse.json(
//       { message: "All fields are required" },
//       { status: 400 }
//     );
//   }
//   console.log(password);

//   // ตรวจสอบรูปแบบอีเมล
//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailPattern.test(email)) {
//     return NextResponse.json(
//       { message: "Invalid email format" },
//       { status: 400 }
//     );
//   }

//   // ตรวจสอบความยาวหมายเลขโทรศัพท์
//   if (phonenumber.length !== 10) {
//     return NextResponse.json(
//       { message: "Phone number must be 10 digits" },
//       { status: 400 }
//     );
//   }

//   const newUser = new User({
//     email: email,
//     password: password,
//     fullname: fullname,
//     gender: gender,
//     phonenumber: phonenumber,
//     username: username,
//     timeStamp: Date.now(),
//   });

//   await newUser.save();
//   return NextResponse.json(
//     {
//       message: "User registered successfully",
//     },
//     { status: 201 }
//   );
// }

// export async function POST(request: NextRequest) {
//   const data = await request.json();
//   const { email, password, fullname, gender, phonenumber, username } = data;

//   if (!email || !password || !fullname || !gender || !phonenumber || !username) {
//     return NextResponse.json(
//       { message: "All fields are required" },
//       { status: 400 }
//     );
//   }
//   console.log(password);

//   // ตรวจสอบรูปแบบอีเมล
//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailPattern.test(email)) {
//     return NextResponse.json(
//       { message: "Invalid email format" },
//       { status: 400 }
//     );
//   }

//   // ตรวจสอบความยาวหมายเลขโทรศัพท์
//   if (phonenumber.length !== 10) {
//     return NextResponse.json(
//       { message: "Phone number must be 10 digits" },
//       { status: 400 }
//     );
//   }

//   const redis = new Redis({
//     url: process.env.UPSTASH_REDIS_URL,
//     token: process.env.UPSTASH_REDIS_TOKEN,
//   });

//   try {
//     const olddata: any = await redis.get("movielist-userdata-sql");

//     if (!olddata || olddata === "") {
//       const userdata = [];
//       userdata.push({
//         email: email,
//         password: password,
//         fullname: fullname,
//         gender: gender,
//         phonenumber: phonenumber,
//         username: username,
//         timeStamp: Date.now(),
//       });
//       await redis.set("movielist-userdata-sql", JSON.stringify(userdata));
//     } else {

//       const finddata = olddata.findIndex((item: any) => item.username === username);
//       const findemail = olddata.findIndex((item: any) => item.email === email);

//       if (finddata !== -1) {
//         return NextResponse.json(
//           { message: "มีผู้ใช้ในระบบแล้ว" },
//           { status: 409 }
//         );
//       } else if (findemail !== -1) {
//         return NextResponse.json(
//           { message: "มีในระบบแล้ว" },
//           { status: 409 }
//         );
//       }

//       else {

//         olddata.push({
//           email: email,
//           password: password,
//           fullname: fullname,
//           gender: gender,
//           phonenumber: phonenumber,
//           username: username,
//           timeStamp: Date.now(),
//         });
//         await redis.set("movielist-userdata-sql", JSON.stringify(olddata));
//       }
//     }

//     return NextResponse.json(
//       { message: "สมัครสมาชิกสำเร็จ" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error accessing Redis:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

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
