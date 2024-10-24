import { gettoken } from "@/app/data/gettoken";
import { Redis } from "@upstash/redis";
import { redirect } from "next/navigation";
import Client_forget_page from "./Client_forget_page";
import ForgetUser from "@/model/ForgetUser";
import User from "@/model/User";
import { forget_getuser } from "@/app/data/action/Forget";

async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = params.id;
  const user =await forget_getuser(token);
  if(user==null){
    redirect("/")
  }

  return (
    <div className="mt-40">
      {/* error */}
      {/* <Client_forget_page
        id={params.id}
        data={user}
        time={60}
      ></Client_forget_page> */}
    </div>
  );
}

export default Page;
