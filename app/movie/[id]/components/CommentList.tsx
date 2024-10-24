import Container from "@/app/components/Container";
import { getuser } from "@/app/data/action/serversubmit";
import { authOptions } from "@/app/lib/authOptions";
import MovieComment from "@/model/Movie_Comment";
import { Redis } from "@upstash/redis";
import { error, log } from "console";
import { getServerSession } from "next-auth";
import React from "react";

async function CommentList({ id }: { id: number }) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  
  // const datalist: any = (await redis.get("movie_message")) || [];
  // const filtered = datalist.filter((item: any) => item.movie_id === id);
  // let data = filtered;
  
  console.log(id);
  
  // const datalist =await MovieComment.find({movie_id : id});
  const datalist = await MovieComment.find({ movie_id: id })
      .populate('user_id', 'email') // ดึงเฉพาะ email จาก User
      .exec();
  console.log(datalist);
  
  const data = datalist;

  return (
    <div className="mb-20">
      <Container>
        <div className="w-full ">
          {data ? (
            data.map(
              (
                item:any,
                index: number
              ) => {
                return (
                  <div className=" border-2 p-10 " key={"comment_" + index}>
                    <h1 className=" text-3xl font-semibold">{item.user_id.email}</h1>
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
