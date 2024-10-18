"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
function Nav() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="shadow-md bg-white absolute top-0 right-0 w-full z-50">
      <nav className="flex flex-row container  mx-auto mt-5 mb-4  ">
        <div className="text-3xl font-bold basis-1/3">
          <a href="/">HOME</a>
        </div>

        <div className="text-xl font-bold basis-1/2 flex flex-row pt-[2px] justify-end max-sm:hidden">
          {session?.user?.email ? (
            <a
              className="mx-12 cursor-pointer text-red-500"
              onClick={() => {
                signOut()
                router.push("/");
              }}
            >
              logout
            </a>
          ) : (
            <a href="/login" className="mx-12">
              login
            </a>
          )}

          <a href="/signup" className="mx-12">
            signup
          </a>
          <a href="/report" className="mx-12 text-red-300">
            report
          </a>
        </div>

        <div className="text-2xl font-bold cursor-pointer">
          {session?.user?.email}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
