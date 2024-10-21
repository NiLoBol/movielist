"use client";
import Container from "@/app/components/Container";
import { useMovieContext } from "@/app/components/context/MovieContext";
import MovieCard from "@/app/components/MovieCard";
import PrevNextButtons from "@/app/components/PrevNextButtons";
import { fetchMovies } from "@/app/data/action/serversubmit";
import React, { useEffect, useState } from "react";

function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { genre, releaseYear, setGenre, setReleaseYear } = useMovieContext();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchMovies(Number(params.id), genre, "2024");
      console.log(fetchedData);
      setData(fetchedData);
    };

    fetchData();
  }, [params.id, genre]); // เพิ่ม params.id ลงใน dependency array

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
      <PrevNextButtons id={params.id} link="/filtermovie/"/>
    </Container>
  );
}

export default Page;
