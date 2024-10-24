"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MovieLoveCard from "./MovieLoveCard";

function Movielist(props: { id: string; data: any }) {
  const data = props.data;
  const { data: session } = useSession();
  const [movieslove, setmovieslove] = useState<[]|null>();
  const [test, settest] = useState([]);

  //get api reload
  useEffect(() => {
    const rest = async () => {
      const email = session?.user?.email;
      const token = session?.user?.token;
      const dataToStore = { email, token };
      const res = await fetch("/api/lovelist/getlist", {
        method: "POST",
        body: JSON.stringify(dataToStore),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      console.log(data);
      
      setmovieslove(data.movielist);
    };
    if (session && movieslove == null) {
      rest();
    }
  }, [session]);

  useEffect(() => {
    if (!movieslove) {
    } else {
      
      const booldata = data.map((movie: any) => {
        return movieslove.some((element: any) => element === movie.id); // ใช้ some แทน filter
      });
      console.log(data);
      console.log(movieslove);
      
      const updatedData = data.map((movie: any, index: number) => ({
        ...movie, // คัดลอกคุณสมบัติของ movie
        bool: booldata[index], // เพิ่มคุณสมบัติใหม่ bool
      }));

      settest(updatedData);

      // ตั้งค่า test เป็นอาร์เรย์ของ true/false
    }
  }, [movieslove]);

  return (
    <>
      {test
        ? test.map((movie: any, index: number) => (
            <MovieLoveCard
              key={"movielovecard-" + movie.id + "" + movie.bool}
              movie={movie}
            />
          ))
        : ""}
    </>
  );
}

export default Movielist;
