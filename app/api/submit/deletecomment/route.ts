import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import MovieComment from "@/model/Movie_Comment";
export async function POST(request: NextRequest) {
  const data = await request.json();

  const { email, token, _id } = data;

  if (!email || !token || !_id) {
    return NextResponse.json(
      { message: "Email and token are required" },
      { status: 400 }
    );
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return NextResponse.json({ message: "user not found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(String(user._id), token);

  if (!isValid) {
    return NextResponse.json({ message: "token not found" }, { status: 405 });
  } else {
    
    const commentdelete = await MovieComment.deleteOne({
      user_id: user._id,
      _id: _id,
    });
    if (commentdelete.deletedCount === 1) {
      return NextResponse.json(
        { message: "Comment deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }
  }

}
