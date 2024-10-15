import React from 'react'
import Container from './Container'
import Movielist from './Movielist'
import PrevNextButtons from './PrevNextButtons'

async function MoviePage(props:{id:string}) {
  const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=7ca3f284a92b4fcd5ff87c0fee8a4cdf&page=${props.id}`;
  const res_movielist = await fetch(url, {
    method: "GET",
    cache: "no-store", // To ensure the fetch is done on every request (optional)
  });
  if (!res_movielist.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res_movielist.json();

  return (
    <div>
      <h1 className="text-5xl mt-32  text-center">Movie List</h1>
      <Container>
        <div className="flexbase my-20">
          <Movielist key={props.id} id={props.id} data={data.results}/>
        </div>
        <PrevNextButtons id={props.id} />
      </Container>
    </div>
  )
}

export default MoviePage
