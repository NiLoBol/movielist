import React from 'react'
import MoviePage from '../components/MoviePage';

function page({
    params,
    searchParams,
  }: {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
  }) {
    
  return (
    <div>
      <MoviePage id={params.id}/>
    </div>
  )
}

export default page
