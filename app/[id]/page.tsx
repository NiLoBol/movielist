import React from 'react'
import Container from '../components/Container';
import Movielist from '../components/Movielist';
import PrevNextButtons from '../components/PrevNextButtons';
import MoviePage from '../components/MoviePage';

function page({
    params,
    searchParams,
  }: {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
   
  return (
    <MoviePage id={params.id}/>
  )
}


export default page
