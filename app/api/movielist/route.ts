import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/model/User";
interface Movie {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: { id: number; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: { iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { email, token } = data;

  if (!email || !token) {
    return NextResponse.json(
      { message: "Email and token are required" },
      { status: 400 }
    );
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const userdata = user.movielist;

  // ใช้ Promise.all เพื่อดึงข้อมูลภาพยนตร์
  const listmoviePromises = userdata.map(async (item: { id: number }) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${item.id}?api_key=7ca3f284a92b4fcd5ff87c0fee8a4cdf`,
      {
        method: "GET",
      }
    );
    return response.json();
  });

  // รอให้ทุกคำขอเสร็จสิ้น
  const listmovie = await Promise.all(listmoviePromises);
  return NextResponse.json({ message: "get user", listmovie }, { status: 200 });
}
