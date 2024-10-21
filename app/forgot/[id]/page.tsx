import { gettoken } from "@/app/data/gettoken";
import { Redis } from "@upstash/redis";
import { redirect } from "next/navigation";
import Client_forget_page from "./Client_forget_page";

async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = params.id;

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  const user: any = await redis.get("forgot_user");
  const find = user.findIndex(
    (item: { token: string }) => item.token === token
  );
  console.log(find);
  if (find === -1) {
    redirect("/");
  }
  const time = Number(user[find].expiry) - Date.now();
  if (time < 0) {
    redirect("/");
  }

  return (
    <div className="mt-40">
      <Client_forget_page
        id={params.id}
        data={user[find]}
        time={time}
      ></Client_forget_page>
    </div>
  );
}

export default Page;
