import { useSession, signIn, signOut } from "next-auth/react";
import Movielist from "./components/Movielist";
import Container from "./components/Container";
import MoviePage from "./components/MoviePage";

export default function Home() {
  return (
    <div>
      <MoviePage id="1"/>
      {/* <Test/> */}
    </div>
  );
}
