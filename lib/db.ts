// lib/connectMongoDB.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

let isConnected: boolean = false; // สถานะการเชื่อมต่อ

export const connectMongoDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return; // ถ้าเชื่อมต่อแล้วไม่ต้องเชื่อมต่ออีก
  }

  try {
    await mongoose.connect(MONGODB_URI);
      
    isConnected = true; // ตั้งค่าสถานะการเชื่อมต่อ
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
