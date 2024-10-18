import { gettoken } from '@/app/data/gettoken';
import { Redis } from '@upstash/redis';


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
  
  return (
    <div className='mt-40'>
      test page {params.id}
    </div>
  );
}

export default Page;