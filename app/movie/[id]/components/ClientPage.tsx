"use client";
import Container from "@/app/components/Container";
import React from "react";

function ClientPage(props: { movie: any }) {
  const movie = props.movie;
  const baseurl = "https://image.tmdb.org/t/p/w500";
  console.log(movie);

  return (
    <Container>
      <div className="flexbase justify-center items-center">
        <div className="basis-full text-4xl font-bold text-center my-12 ">
          {movie.title}
        </div>
        <div className="lg:basis-1/2 basis-full px-32 justify-center ">
          <img
            className="mx-auto my-10"
            src={`${baseurl}${movie.poster_path}`}
            alt=""
          />
        </div>
        <div className="lg:basis-1/2 basis-full mb-32">
          
          <div className="text-3xl font-bold my-4 ">overview</div>
          <div className="text-2xl font-medium ">{movie.overview}</div>
          <div className="text-3xl font-bold  my-4">
            Budget : {movie.budget} 
          </div>
          <div className="text-xl">
            Genres :
            <span className="text-xl ms-2">
              {movie.genres.map(
                (item: { id: number; name: string }, index: number) => {
                  if (index == movie.genres.length - 1) {
                    return (
                      <span key={"genres_" + index} className="text-xl">
                        {item.name}
                      </span>
                    );
                  } else {
                    return (
                      <span key={"genres_" + index} className="text-xl">
                        {item.name} ,{" "}
                      </span>
                    );
                  }
                }
              )}
            </span>
          </div>
          <div className="text-xl">Rating : {movie.vote_average}/10</div>
          <div className="text-xl">Runtime: {movie.runtime} minutes</div>
          <div className="text-xl">
            Language :{" "}
            {movie.spoken_languages.map(
              (item: { id: number; name: string }, index: number) => {
                if (index == movie.spoken_languages.length - 1) {
                  return (
                    <span key={"spoken_languages_" + index} >
                      {item.name}
                    </span>
                  );
                } else {
                  return (
                    <span key={"spoken_languages_" + index} >
                      {item.name} ,{" "}
                    </span>
                  );
                }
              }
            )}
          </div>
          <div className="text-2xl my-5">Link</div>
          <a className="text-xl block" href={movie.homepage}>homepage</a>
          <a className="text-xl block" href={"https://www.imdb.com/title/"+movie.imdb_id}>imdb</a>
        </div>
      </div>
      {/* <div className="flexbase ">
        <div className="text-2xl">movie.production_companies</div>
        {movie.production_companies.map(
          (item: { logo_path: string; id: string }) => {
            return (
              <img
                key={"img_logo_path" + item.id}
                src={`${baseurl}${item.logo_path}`}
                alt=""
              />
            );
          }
        )}
      </div> */}
    </Container>
  );
}

export default ClientPage;
