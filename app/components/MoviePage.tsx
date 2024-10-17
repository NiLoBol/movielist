import React from "react";
import Container from "./Container";
import Movielist from "./Movielist";
import PrevNextButtons from "./PrevNextButtons";
// api_key=7ca3f284a92b4fcd5ff87c0fee8a4cdf&
// moviepageเปลี่ยนการทำงาน props: { id: string } =>url แทน
// PrevNextButtons ต้องเพิ่ม urlเข้าไปด้วย แต่ไม่ใช้url api เป็น url web
async function MoviePage(props: { id: string }) {
  const url = `https://api.themoviedb.org/3/trending/movie/week?page=${props.id}`;
  const res_movielist = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2EzZjI4NGE5MmI0ZmNkNWZmODdjMGZlZThhNGNkZiIsIm5iZiI6MTcyOTA3MTkxNy45MTczNDIsInN1YiI6IjYzMTA3NDgzNjA2MjBhMDA4M2U2MTQyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lKUkgikBlG5pmdyjCZ_3mu1c5NmKhVi7rOmR05ACcQM",
    }, // To ensure the fetch is done on every request (optional)
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
          <Movielist key={props.id} id={props.id} data={data.results} />
        </div>
        <PrevNextButtons id={props.id} />
      </Container>
    </div>
  );
}

export default MoviePage;
