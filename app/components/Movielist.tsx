"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MovieLoveCard from "./MovieLoveCard";

function Movielist(props: { id: string; data: any }) {
  const data = props.data;
  const { data: session } = useSession();
  const [movieslove, setmovieslove] = useState([]);
  const [test, settest] = useState([]);

  //get api reload
  useEffect(() => {
    const rest = async () => {
      const email = session?.user?.email;
      const token = session?.user?.name;
      const dataToStore = { email, token };
      const res = await fetch("/api/lovelist/getlist", {
        method: "POST",
        body: JSON.stringify(dataToStore),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setmovieslove(data.userdata);
    };
    if (session) {
      rest();
    }
  }, [session]);
  
  useEffect(() => {
    const booldata = data.map((movie: any) => {
      return movieslove.some((element: any) => element.id === movie.id); // ใช้ some แทน filter
    });
    const updatedData = data.map((movie: any, index: number) => ({
      ...movie, // คัดลอกคุณสมบัติของ movie
      bool: booldata[index], // เพิ่มคุณสมบัติใหม่ bool
    }));
    
    settest(updatedData);
     
     // ตั้งค่า test เป็นอาร์เรย์ของ true/false
  }, [movieslove, data]);
  
  return (
    <>
      {test?test.map((movie: any,index:number) => (
        <MovieLoveCard
          key={"movielovecard-" + movie.id+""+movie.bool}
          movie={movie}
        />
      )):""}
    </>
  );
}

export default Movielist;
