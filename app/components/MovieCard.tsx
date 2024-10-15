import React from "react";

function MovieCard(props: { movie: any }) {
  const movie = props.movie;
  const baseurl = "https://image.tmdb.org/t/p/w500";
  return (
    <a className="xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-4 cursor-pointer" 
    id={"movie-"+movie.id} key={movie.id}  href={`/movie/${movie.id}`}
    >
      <div className="card">
        {movie.poster_path && (
          <img
            src={`${baseurl}${movie.poster_path}`}
            alt={movie.title}
          />
        )}
          <h2>{movie.title}</h2>
      </div>
    </a>
  );
}

export default MovieCard;
