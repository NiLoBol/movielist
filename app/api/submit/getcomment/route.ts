import type { NextApiRequest, NextApiResponse } from "next";

import { NextRequest, NextResponse } from "next/server";
import { getuser } from "@/app/data/action/serversubmit";
import MovieComment from "@/model/Movie_Comment";
export async function POST(request: NextRequest) {
  const data = await request.json();

  const { email, token } = data;

  if (!email || !token) {
    return NextResponse.json(
      { message: "Email and token are required" },
      { status: 400 }
    );
  }
  const user = await getuser(email, token);
  console.log(user);
  
  if (!user) {
    return NextResponse.json({ message: "user not found" }, { status: 404 });
  }
  const commentuser = await MovieComment.find({ user_id: user._id });
  if(commentuser){
  return NextResponse.json({ commentuser }, { status: 201 });
  }
  else{
    
  return NextResponse.json({ message:"comment not found" }, { status: 405 });
  }
  return NextResponse.json({ message:"error not found" }, { status: 406 });
}
