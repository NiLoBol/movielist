import React from 'react'

// จะทำการกรอง ละดึงทำ url moviepage 

function page({
    params,
    searchParams,
  }: {
    params: { id2: string ,id:string}
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
   
  return (
    // <MoviePage id={params.id}/>
    <div className='text-center my-28 text-6xl '>{params.id}/{params.id2}</div>
  )
}


export default page
