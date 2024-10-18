"use server";
import { Redis } from "@upstash/redis";
import emailjs from "emailjs-com";
export async function serversubmit(formdata: FormData) {
  console.log("test on server");
}
interface PasswordResetRequest {
  email: string;
  token: string;
  expiry: number;
}

const createPasswordResetRequest = (email: string): PasswordResetRequest => {
  const token = generateToken();
  const expiry = Date.now() + 10 * 60 * 1000; // เวลาหมดอายุ 10 นาทีใน milliseconds

  return {
    email,
    token,
    expiry,
  };
};

const generateToken = (): string => {
  return Math.random().toString(36).substring(2);
};

export const severtests = async (resdata: PasswordResetRequest) => {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  const user: any = await redis.get("movielist-userdata-sql");
  const find = user.findIndex(
    (item: { email: string }) => item.email === resdata.email
  );
  if (find == -1) {
    return null;
  } else {
    const data: any = await redis.get("forgot_user");
    if (data == null) {
      const data = [];
      data.push(resdata);
      await redis.set("forgot_user", data);
    } else {
      const filter = data.filter(
        (item: PasswordResetRequest) => item.expiry > Date.now()
      );
      console.log(filter);
      const filter2 = filter.filter(
        (item: PasswordResetRequest) => item.email !== resdata.email
      );
      console.log(filter2);
      filter2.push(resdata);
      // data.push(resdata)
      await redis.set("forgot_user", filter2);
    }
  }
};
