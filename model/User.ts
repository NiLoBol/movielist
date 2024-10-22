// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  gender: string; // สามารถกำหนดให้เป็น 'male' | 'female' | 'other' ได้ถ้าต้องการ
  phonenumber: string;
  username: string;
  timeStamp: Date;
}

const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  gender: { type: String, enum: ['ชาย', 'หญิง'], required: true },
  phonenumber: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  timeStamp: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
