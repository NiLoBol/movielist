"use client";
import { useSession } from "next-auth/react";
import React, { use, useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import Report_Card from "./Report_Card";
import PieChart from "./PieChart";
import Blacklove from "./svg/Blacklove";
import Delete from "./svg/Delete";
import GetcommentUser from "./GetcommentUser";

const ReportPage = () => {
  const [movieslove, setMoviesLove] = useState<any[]>([]);
  const [state, setstate] = useState<"loading" | "list" | "nouser" |"nodata">("loading");
  const [genresList, setGenresList] = useState<
    { id: number; name: string; count: number }[]
  >([]);
  const [comments, setComments] = useState<any>([]);
  const [genres, setGenres] = useState<{
    id: number;
    name: string;
    count: number;
  } | null>(null);
  const { data: session } = useSession();
  const [stop, setstop] = useState(false);
  const remove = async (movieid: number) => {
    const email = session?.user?.email;
    const token = session?.user?.name;

    if (email) {
      const findIndex = movieslove.findIndex((item) => item.id === movieid);

      if (findIndex !== -1) {
        // Create a new array to remove the movie
        const newMoviesLove = [...movieslove];
        newMoviesLove.splice(findIndex, 1); // Remove the movie

        // Update the state with the new array
        setMoviesLove(newMoviesLove);
      }

      const dataToStore = { email, id: movieid, token };
      // Uncomment and use this to send a request to your API
      const res = await fetch("/api/lovelist/setlist", {
        method: "POST",
        body: JSON.stringify(dataToStore),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      console.error("Email not defined");
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const email = session?.user?.email;
      const token = session?.user?.name;

      if (!email || !token) return;

      const dataToStore = { email, token };
      const res = await fetch("/api/movielist", {
        method: "POST",
        body: JSON.stringify(dataToStore),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch data");
        setstate("loading"); // Stop loading if there's an error
        return;
      }
      const data = await res.json();

      const comment = await fetch("/api/submit/getcomment", {
        method: "POST",
        body: JSON.stringify(dataToStore),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!comment.ok) {
        console.error("Failed to fetch data");
        setstate("list"); // Stop loading if there's an error
        return;
      }
      const commentdata = await comment.json();
      setComments(commentdata);
      setMoviesLove(data.listmovie);

      setstate("list");
    };

    if (session) {
      if (stop) {
      } else {
        fetchMovies();
        setstop(true);
      }
    } else if (session === null) {
      setstate("nouser");
      console.log("ไม่มีผู้ใช้งาน");
      alert("Please log in.");
    } else {
      
      console.log("อาจมีผู้ใช้งาน");
    }
  }, [session]);
  useEffect(() => {
    console.log(comments);
    console.log(movieslove);
    
    
        if(comments?.userdata?.length>0){
          console.log("have comment");
        }else{
          console.log(movieslove);
          if(movieslove.length>0){
            console.log("have movie");
          }
          else{
            console.log("no data");
            setstate("nodata")
          }
          console.log("no comment");
        }
  }, [comments,movieslove])
  
  useEffect(() => {
    const genresCount: { [key: number]: number } = {};
    const genresNames: { [key: number]: string } = {};
    if (!movieslove) {
    } else {
      movieslove.forEach((item: any) => {
        item.genres.forEach((genre: { id: number; name: string }) => {
          genresCount[genre.id] = (genresCount[genre.id] || 0) + 1; // Increment genre count
          genresNames[genre.id] = genre.name;
        });
      });

      const genresList = Object.entries(genresCount).map(([id, count]) => ({
        id: Number(id),
        name: genresNames[Number(id)],
        count: count,
      }));

      const maxGenre = genresList.reduce(
        (max, genre) => (genre.count > max.count ? genre : max),
        genresList[0]
      );
      setGenresList(genresList);
      setGenres(maxGenre);
    }
  }, [movieslove]);

  if (state == "loading") {
    return <div>Loading ....</div>;
  } else if (state == "nouser") {
    return <div>Please log in to view your favorite movies.</div>;
  }
  if(state == "nodata"){
    return(<div>no data</div>)
  }
  return (
    <div className="flexbase ">
      <Report_Card
        head="Genres Favorite"
        title={genres ? genres.name : "not defind"}
      ></Report_Card>

      <Report_Card
        head="Movie Favorite Count"
        title={movieslove ? movieslove.length : 0}
      ></Report_Card>
      {movieslove ?<div className="basis-1/4">
        {genresList ? (
          <PieChart genresList={genresList} />
        ) : (
          <div>No genres available to display.</div>
        )}
      </div>:<></>}
      <GetcommentUser comment={comments} />
      <div className="basis-1/2 text-center mb-20 text-4xl font-bold"></div>
      {movieslove ?<div className="basis-full text-center mb-20 text-4xl font-bold">
        Favorite List
      </div>:<></>}
      {movieslove ? (
        movieslove.map((item: any, index: number) => (
          <React.Fragment key={item.id}>
            <MovieCard key={"movie:" + index} movie={item}></MovieCard>
            <div
              key={"delete:" + index}
              className="card-delete"
              id={"love_movie" + item.id}
              onClick={() => remove(item.id)}
            >
              <Delete />
            </div>
          </React.Fragment>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default ReportPage;
