import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import MovieComment from "@/model/Movie_Comment";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { email, token, _id, message } = data;

  // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
  if (!email || !token || !_id || !message) {
    return NextResponse.json(
      { message: "Email, token, id, and message are required" },
      { status: 400 }
    );
  }

  // ค้นหาผู้ใช้ตามอีเมล
  const user = await User.findOne({ email: email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // ตรวจสอบความถูกต้องของ token
  const isValid = await bcrypt.compare(String(user._id), token);
  if (!isValid) {
    return NextResponse.json({ message: "Token not valid" }, { status: 401 });
  } else {
    // อัปเดตความคิดเห็น
    const updatedComment = await MovieComment.findOneAndUpdate(
      { user_id: user._id, _id: _id },
      { message: message }, // อัปเดตข้อความความคิดเห็น
      { new: true } // คืนค่าข้อมูลใหม่หลังการอัปเดต
    );

    // ตรวจสอบว่าการอัปเดตสำเร็จหรือไม่
    if (updatedComment) {
      return NextResponse.json(
        { message: "Comment updated successfully" },
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
