import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import User, { IMovie } from "@/model/User";
export async function POST(request: NextRequest) {
  
  const data = await request.json();

  const { email, token } = data;

  if (!email || !token) {
    return NextResponse.json(
      { message: "Email and token are required" },
      { status: 400 }
    );
  }
  try {
    await connectMongoDB();
} catch (error) {
    return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
    );
}
  const user  = await User.findOne({ email });
  if(user){
    const isValid = await bcrypt.compare(String(user._id),token);
    
    if(isValid){
      const movielist =user.movielist.map((item:IMovie) => item.id)
      return NextResponse.json({  movielist}, { status: 201 });
    }
    else{
      return NextResponse.json({ message: "token fail" }, { status: 401 });
    }
  }
  else {
    return NextResponse.json({ message: "api fail" }, { status: 401 });
  }
}
