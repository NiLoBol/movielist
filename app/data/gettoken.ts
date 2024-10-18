"use server";
import { Redis } from "@upstash/redis";

export async function gettoken(token: string){
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_URL,
        token: process.env.UPSTASH_REDIS_TOKEN,
      });
      const user: any = await redis.get("forgot_user");
      const find = user.findIndex(
        (item: { token: string }) => item.token === token
      );
      return find
} 