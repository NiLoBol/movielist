// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/db'; 
import User from '@/model/User'; 

export async function GET() {
  

  const users = await User.find({});
  return NextResponse.json(users);
}

export async function POST(request: Request) {
    await connectMongoDB();
  
    const body = await request.json();
  
    // สร้างผู้ใช้ใหม่
    const newUser = new User({
      email: body.email,
      password: body.password,
      fullname: body.fullname,
      gender: body.gender,
      phonenumber: body.phonenumber,
      username: body.username,
      timeStamp: Date.now(),
    });
  
    await newUser.save();
  
    return NextResponse.json(newUser, { status: 201 });
  }