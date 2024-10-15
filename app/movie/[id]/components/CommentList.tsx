import Container from "@/app/components/Container";
import { Redis } from "@upstash/redis";
import { error } from "console";
import React from "react";

async function CommentList({ id }: { id: number }) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });

  const datalist: any = (await redis.get("movie_message")) || [];
  const filtered = datalist.filter((item: any) => item.movie_id === id);
  let data = filtered;
  

  return (
    <div className="mb-20">
      <Container>
        <div className="w-full ">
          {data ? (
            data.map(
              (
                item: { email: string; message: string; timestamp: string },
                index: number
              ) => {
                return (
                  <div className=" border-2 p-10 " key={"comment_" + index}>
                    <h1 className=" text-3xl font-semibold">{item.email}</h1>
                    <p className=" text-xl font-medium">{item.message}</p>
                  </div>
                );
              }
            )
          ) : (
            <></>
          )}
        </div>
      </Container>
    </div>
  );
}

export default CommentList;
