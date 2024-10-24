import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface สำหรับประเภทของข้อมูลใน movieList
export interface IMovie {
  id: number;
  timestamp: Date;
}

// เพิ่ม interface IMovie ใน IUser
export interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  gender: string; // 'ชาย' | 'หญิง'
  phonenumber: string;
  username: string;
  timeStamp: Date;
  movielist: IMovie[]; // เปลี่ยนเป็น IMovie[]
}

// สร้าง Schema สำหรับ movieList
const MovieSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

// ปรับปรุง userSchema เพื่อรวม movielist
const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  gender: { type: String, enum: ['ชาย', 'หญิง'], required: true },
  phonenumber: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  timeStamp: { type: Date, default: Date.now },
  movielist: { type: [MovieSchema], default: [], required: true }, // เพิ่ม movielist เข้าไปที่นี่
});

// สร้าง model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
