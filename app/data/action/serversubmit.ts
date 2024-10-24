"use server";
import bcrypt from "bcrypt";
import { Redis } from "@upstash/redis";
import emailjs from "emailjs-com";
import User from "@/model/User";
import ForgetUser from "@/model/ForgetUser";
export async function serversubmit(formdata: FormData) {
  console.log("test on server");
}
interface PasswordResetRequest {
  email: string;
  token: string;
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


export const getIpAddress = async () => {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  return data.ip;
};
export const severtests = async (email: string,token:string) => {
  // const ip = await getIpAddress();
  const user = await User.findOne({ email }, { email: 1, _id: 1 });

  if (!user) {
    return null;
  }

  
  
  const newForgetUser = new ForgetUser({
    userId: user._id, // รหัสผู้ใช้
    email: email, // อีเมลของผู้ใช้
    token: token, // สร้าง token แบบสุ่ม
    expiresAt: new Date(Date.now() + 24 * 60 * 1000), // หมดอายุใน 1 นาที
  });
  // return null;
  await newForgetUser.save();
  return "Success";
};

export const set_newpassword = async (password: string, token: string) => {
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
    const forgot_user: PasswordResetRequest[] | null = await redis.get(
      "forgot_user"
    );
    if (forgot_user) {
      const findindex_user_token = forgot_user.findIndex(
        (item: PasswordResetRequest) => item.token === token
      );
      const email = forgot_user[findindex_user_token].email;
      const findindex_email_user = user.findIndex(
        (item: any) => item.email === email
      );
      if (findindex_user_token == -1 || findindex_email_user == -1) {
        return "Invalid token";
      } else {
        user[findindex_email_user].password = hashedPassword;
        await redis.set("movielist-userdata-sql", user);
      }
    } else {
      console.error("token is undefind");
    }
    // Optionally return the hashed password for further use
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error; // Rethrow the error for further handling
  }
};

export const fetchMovies = async (
  page: number,
  genre: string,
  startYear: string | number,
  endYear: string | number
) => {
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
    return data;
  }
};
function generateRandomToken() {
  return Math.random().toString(36).substring(2, 15); // สุ่ม token
}

export async function backupuser() {
  const redis = new Redis({
    url: "https://equal-aphid-35928.upstash.io",
    token: "AYxYAAIjcDE4NDA5ZTY0MjBlYjA0ODE1YjY5MDA4YzI4N2I3NjgwZXAxMA",
  });

  for (let index = 0; index < 10; index++) {
    const randomNumber = Math.floor(Math.random() * 10000000000);
    const username = generateRandomToken(); // สร้าง username
    const password = generateRandomToken(); // สร้าง password
    const token = generateRandomToken(); // สร้าง token
    const user = JSON.stringify({ username, password, token, randomNumber });
    await redis.lpush("users", user);
    console.log(`User ${user} created with phone number: ${randomNumber}`);
  }
  // client.keys('user:*');
  // const user =await redis.smembers("user")
  // console.log(user);

  return null;
}

export const toggleMovieForUser = async (
  userEmail: string,
  movieId: number
) => {
  try {
    // ค้นหาผู้ใช้ที่มี movielist รวมทั้งการตรวจสอบ id
    const user = await User.findOne({
      email: userEmail,
      movielist: { $elemMatch: { id: movieId } },
    });

    if (user) {
      // ถ้าผู้ใช้พบ ให้ลบภาพยนตร์
      await User.findOneAndUpdate(
        { email: userEmail },
        { $pull: { movielist: { id: movieId } } },
        { new: true }
      );
      console.log(
        `Movie with ID ${movieId} has been removed from user's movielist.`
      );
    } else {
      // ถ้าผู้ใช้ไม่พบ ให้เพิ่มภาพยนตร์
      const date = Date.now();
      await User.findOneAndUpdate(
        { email: userEmail },
        { $push: { movielist: { id: movieId, timestamp: date } } },
        { new: true }
      );
      console.log(
        `Movie with ID ${movieId} has been added to user's movielist.`
      );
    }
  } catch (error) {
    // console.log(userEmail);
    console.error("Error toggling movie for user:", error);
  }
};

export const getuser = async (userEmail: string, token: string) => {
  try {
    const user = await User.findOne({ email: userEmail });
    if (user) {
      const isValid = await bcrypt.compare(String(user._id), token);
      if (isValid) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getmovie = async (userEmail: string, movieId: number) => {
  try {
    // ค้นหาผู้ใช้ที่มี movielist รวมทั้งการตรวจสอบ id
    const user = await User.findOne({
      email: userEmail,
      movielist: { $elemMatch: { id: movieId } },
    });

    if (user) {
      // ถ้าผู้ใช้พบ ให้ลบภาพยนตร์
      await User.findOneAndUpdate(
        { email: userEmail },
        { $pull: { movielist: { id: movieId } } },
        { new: true }
      );
      console.log(
        `Movie with ID ${movieId} has been removed from user's movielist.`
      );
    } else {
      // ถ้าผู้ใช้ไม่พบ ให้เพิ่มภาพยนตร์
      const date = Date.now();
      await User.findOneAndUpdate(
        { email: userEmail },
        { $push: { movielist: { id: movieId, timestamp: date } } },
        { new: true }
      );
      console.log(
        `Movie with ID ${movieId} has been added to user's movielist.`
      );
    }
  } catch (error) {
    // console.log(userEmail);
    console.error("Error toggling movie for user:", error);
  }
};
