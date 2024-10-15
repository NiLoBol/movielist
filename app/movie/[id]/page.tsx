import Container from '@/app/components/Container'
import React from 'react'
import ClientPage from './components/ClientPage'
import Comment from './components/Comment'
import CommentList from './components/CommentList'


async function page({
    params,
    searchParams,
  }: {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
   const url =`https://api.themoviedb.org/3/movie/${params.id}?api_key=7ca3f284a92b4fcd5ff87c0fee8a4cdf`
   const baseurl = "https://image.tmdb.org/t/p/w500";
    const res = await fetch(url);
    const movie = await res.json();
    console.log(movie);
    
  return (
    
    <div className='mt-28'>
        <ClientPage movie={movie}/>
        <Comment id={movie.id}></Comment>
        <CommentList id={movie.id}></CommentList>
    </div>
  )
}


export default page
