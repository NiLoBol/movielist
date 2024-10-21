"use client";
import React, { useEffect, useState } from "react";
import Movielist from "../components/Movielist";
import MovieCard from "../components/MovieCard";
import Container from "../components/Container";
import { fetchMovies } from "../data/action/serversubmit";
// เปลี่ยนเป็นหน้าที่ filter หนังได้ หนังปี20... แนวไหน...
// วิธีการส่งข้อมูลแบบไหนดี
// 1. props
// 2. state
// 3. context
// 4. callback function
// filter เสร็จอยู่หน้าเดิม แรกcomponent หนังมาโดยเปลี่ยน  url ตามที่เลือกไว้ ข้อเสีย โดนดึงdata ง่าย
// ถ้าอยู่หน้าเดิมจะส่งข้อมูล state ไป ดูง่ายและเร็วกว่า
// ไปหน้าใหม่ ส่ง ผ่าน urlไปละก็ฟิลเตอร์แสดง
// ข้อมูลที่ต้องเลือก  with_genres=xxx,xxx , with_genres=xxx|xxx และกับหรือ สามารถดึงได้หลายแบบ
// primary_release_year ปีที่จะแสดง
//  sort_by...
function Page() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState<string>("28"); // Default to Action
  const [releaseYear, setReleaseYear] = useState<string>("2022"); // Default year

  useEffect(() => {
    const response = async () => {
      const data = await fetchMovies(page, genre, releaseYear);
      console.log(data);
      setData(data)
    };
    response();
    
  }, [page, genre, releaseYear]); // Fetch movies whenever page, genre or releaseYear changes

  return (
    <Container>
      <div className="flexbase mt-28">
        {/* Dropdown for genres */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="mb-4 basis-1/2"
        >
          <option value="28">Action</option>
          <option value="12">Adventure</option>
          <option value="14">Fantasy</option>
          <option value="35">Comedy</option>
          {/* Add more options as needed */}
        </select>

        {/* Dropdown for release years */}
        <select
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          className="mb-4 basis-1/2"
        >
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2021">2021</option>
          {/* Add more years as needed */}
        </select>

        {data ? (
          data.results.map((movie: any, index: number) => (
            <div className="basis-1/5 p-3" key={"m" + index}>
              <MovieCard key={"movielovecard-" + movie.id} movie={movie} />
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="mr-2"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)} className="ml-2">
          Next
        </button>
      </div>
    </Container>
  );
}

export default Page;
