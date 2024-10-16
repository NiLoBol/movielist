"use client";
import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { useSession } from "next-auth/react";
import bcrypt from "bcryptjs";
import Redlove from "./svg/Redlove";
import Blacklove from "./svg/Blacklove";

function MovieLoveCard(props: { movie: any }) {
  const movie = props.movie;
  //   useeffect มันจะทำจำนวน card รอบ เพราะแต่ละ card จะมี
  //   เป็นของตัวเอง ดังนั้น ถ้าใช้วิธีการวนหา love ของตัวเอง มันจะ
  //   เรียก api ตามจำนวน card ดังนั้นจึงเรียกจาก แม่ ทีเดียว แล้วส่งไปหาลูกๆแทน
  const [love, setlove] = useState(props.movie.bool);
  const { data: session } = useSession();
  const lovef = async () => {
    const email = session?.user?.email; // เปลี่ยนเป็นอีเมลจริง
    // console.log(session);
    const token = session?.user?.name;
    if (!email || !token) {
      alert("กรุณา Login");
    } else {
      setlove(!love);

      if (email) {
        // const token = await bcrypt.hash(email, 10);
        const dataToStore = { email, id: movie.id, token };
        const res = await fetch("/api/lovelist/setlist", {
          method: "POST",
          body: JSON.stringify(dataToStore),
        });
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        // const data = await res.json();
        // console.log(data);
      } else {
        console.error("email not defind");
      }
    }
  };

  return (
    <>
      <MovieCard movie={movie} />
      <div
        className="card-lover "
        id={"love_movie" + movie.id}
        onClick={() => lovef()}
      >
        {love ? <Redlove /> : <Blacklove />}
      </div>
    </>
  );
}

export default MovieLoveCard;
