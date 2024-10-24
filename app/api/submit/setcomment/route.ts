import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getuser } from "@/app/data/action/serversubmit";
import MovieComment from "@/model/Movie_Comment";


export async function POST(request: NextRequest) {
  const data = await request.json();

  const { email, token, id, message } = data;

  if (!email || !token || !id || !message) {
    return NextResponse.json(
      { message: "Email and token are required" },
      { status: 400 }
    );
  }
  const userone =await getuser(email,token);
  if(userone){
    
    const newComment = new MovieComment({
      movie_id: id,
      user_id: userone._id, // ใช้ user._id แทน email
      message: message,
    });
    await newComment.save();
    return NextResponse.json(
      { message: "comment summit" },
      { status: 201 }
    );
  }
  else{
    return NextResponse.json(
      { message: "Email and token not found" },
      { status: 404 }
    );
  }
}
