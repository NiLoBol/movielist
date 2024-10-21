"use server";
import bcrypt from 'bcrypt';
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
export const getIpAddress = async () => {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  return data.ip;
};
export const severtests = async (resdata: PasswordResetRequest) => {
  const ip = await getIpAddress();
  const upstash_data = {
    ip: ip,
    email: resdata.email,
    expiry: resdata.expiry,
    token: resdata.token,
    ip_count: 0,
  };
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  const user: any = await redis.get("movielist-userdata-sql");
  const find = user.findIndex(
    (item: { email: string }) => item.email === resdata.email
  );
  if (find == -1) {
    return "ไม่เจอข้อมูล";
  } else {
    const data: any = await redis.get("forgot_user");
    if (data == null) {
      const data = [];
      data.push(upstash_data);
      await redis.set("forgot_user", data);
      return "Success";
    } else {
      const filter = data.filter(
        (item: PasswordResetRequest) => item.expiry > Date.now()
      );
      console.log(filter);
      const countip = filter.findIndex(
        (item: PasswordResetRequest) => item.email === resdata.email
      );
      const filter2 = filter.filter(
          (item: PasswordResetRequest) => item.email !== resdata.email
        );
      if (countip !== -1) {
        upstash_data.ip_count = filter[countip].ip_count + 1;

      } else {
      }console.log(filter2);
        filter2.push(upstash_data);
        // data.push(resdata)
        await redis.set("forgot_user", filter2);
        return "Success";
    }
  }
};

export const set_newpassword = async (password: string,token:string) => {
  try {
    // Generate a salt
    const saltRounds = 10; // You can adjust the salt rounds for security
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Log the hashed password (do not log in production)
    console.log("Hashed Password:", hashedPassword);
    console.log(token);
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
    const user: any = await redis.get("movielist-userdata-sql");
    const forgot_user: PasswordResetRequest[]|null = await redis.get("forgot_user");
    if(forgot_user){
      const findindex_user_token = forgot_user.findIndex((item:PasswordResetRequest)=> item.token===token)
      const email = forgot_user[findindex_user_token].email;
      const findindex_email_user = user.findIndex((item:any)=>item.email===email);
      if(findindex_user_token == -1 ||findindex_email_user ==-1){
        return "Invalid token"
      }else{
        user[findindex_email_user].password = hashedPassword;
        await redis.set("movielist-userdata-sql", user);
      }
    }
    else{
      console.error("token is undefind");
      
    }
    // Optionally return the hashed password for further use
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error; // Rethrow the error for further handling
  }
};


export const fetchMovies = async (page:number, genre:string, startYear:string|number,endYear:string|number) => {
const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genre}&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&page=${page}&sort_by=popularity.desc&language=th-TH`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2EzZjI4NGE5MmI0ZmNkNWZmODdjMGZlZThhNGNkZiIsIm5iZiI6MTcyOTA3MTkxNy45MTczNDIsInN1YiI6IjYzMTA3NDgzNjA2MjBhMDA4M2U2MTQyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lKUkgikBlG5pmdyjCZ_3mu1c5NmKhVi7rOmR05ACcQM",
    }, // To ensure the fetch is done on every request (optional)
  });

  if (!res.ok) {
    console.error("API fail");
  } else {
    const data = await res.json();
    return data
  }
};