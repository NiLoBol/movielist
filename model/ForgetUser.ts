import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface สำหรับประเภทของข้อมูลใน ForgetUser
export interface IForgetUser extends Document {
  userId: mongoose.Types.ObjectId; // หรือ string ตามที่คุณต้องการ
  email: string;
  token: string; // รหัสผ่านที่สุ่ม
  expiresAt: Date; // เวลาหมดอายุ
}

// สร้าง Schema สำหรับ ForgetUser
const ForgetUserSchema: Schema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User', // อ้างอิงไปยังโมเดล User
  },
  email: {
    type: String,
    required: true,
    unique: true, // ป้องกันไม่ให้มีอีเมลซ้ำ
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// สร้าง TTL Index โดยที่ expiresAt หมดอายุภายใน 60 วินาที
ForgetUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// สร้าง model
const ForgetUser: Model<IForgetUser> = mongoose.models.ForgetUser || mongoose.model<IForgetUser>('ForgetUser', ForgetUserSchema);

export default ForgetUser;
