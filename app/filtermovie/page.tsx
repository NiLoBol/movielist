"use client";
import React, { useEffect, useState } from "react";
import Radio from "../components/Radio";
import CheckboxGroup from "../components/CheckboxGroup";
import { fetchMovies } from "../data/action/serversubmit";
import MovieCard from "../components/MovieCard";
import { useMovieContext } from "../components/context/MovieContext";
import PrevNextButtons from "../components/PrevNextButtons";
import Container from "../components/Container";
// ถ้าดึงลงตรงนี้ ต้องเปลียนเป็น
function page() {
  const { genre, releaseYear, setGenre, setReleaseYear ,startYear,endYear} = useMovieContext();
  const [data, setData] = useState<any>(null);
  console.log(genre);
  useEffect(() => {
    const res = async () => {
      const data = await fetchMovies(1, genre, startYear,endYear);
      console.log(data);
      setData(data);
    };
    res();
  }, [genre,startYear,endYear]);

  return (
    <Container>
      <div className="flexbase mt-28">
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
      <PrevNextButtons id={"1"} link="/filtermovie/"/>
    </Container>
  );
}

export default page;
