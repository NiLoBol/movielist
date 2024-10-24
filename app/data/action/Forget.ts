import ForgetUser from "@/model/ForgetUser";
import User from "@/model/User";

export async function forget_getuser(token:string) {
    const forget= await ForgetUser.findOne({token});
  if(!forget){
    return null;
  }
  const user = await User.findById(forget.userId);
  if(!user){
    return null;
  }
  return user;
}