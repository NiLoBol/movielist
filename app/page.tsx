import { useSession, signIn, signOut } from "next-auth/react";
import Movielist from "./components/Movielist";
import Container from "./components/Container";
import MoviePage from "./components/MoviePage";
/*{
  movie filter ได้ ดึงเฉพาะ top  action ได้
}*/
export default function Home() {
  return (
    <div>
      <MoviePage id="1"/>
      {/* <Test/> */}
    </div>
  );
}
