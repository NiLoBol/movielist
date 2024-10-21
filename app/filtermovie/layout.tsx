"use client"

import localFont from "next/font/local";
import { fetchMovies } from "../data/action/serversubmit";
import { useEffect, useState } from "react";
import CheckboxGroup from "../components/CheckboxGroup";
import Radio from "../components/Radio";
import { useMovieContext } from "../components/context/MovieContext";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
  };
  const { genre, releaseYear, setGenre, setReleaseYear,selectedRole,setSelectedRole,bools,setBools } = useMovieContext();
  const roles = ["Or", "And"]; // ประเภทอื่น ๆ

  const names = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ];
  const ids = [
    28, 12, 16, 35, 80, 99, 18, 14, 27, 10402, 9648, 10749, 878, 10770, 53,
    10752, 37,
  ];


  const setBoolIndex = (index: number) => {
    setBools((prevBools) =>
      prevBools.map((bool, i) => (i === index ? !bool : bool))
    );
  };
  useEffect(() => {
    const selectedIds = ids.filter((id, index) => bools[index]);
    console.log("Selected IDs:", selectedIds);
    if (selectedRole == "Or") {
      const stringIDs = selectedIds.map((item) => item).join("|");
      setGenre(stringIDs);
      console.log(genre);
    } else {
      const stringIDs = selectedIds.map((item) => item).join(",");
      setGenre(stringIDs);
      console.log(genre);
    }
    sessionStorage.setItem("bools",JSON.stringify(bools));
    sessionStorage.setItem("selectedRole",selectedRole);
  }, [bools, selectedRole]);

  const setBoolFunctions = names.map((_, index) => () => setBoolIndex(index));
  return (
    <div className="container mt-32 mx-auto">
      <Radio
        headname="เลือกเงื่อนไขการแสดงผล"
        radios={roles}
        selectedValue={selectedRole}
        onChange={handleRoleChange}
      />
      {/* <p className="mt-4">Selected role from parent: {selectedRole}</p>{" "} */}
      {/* แสดงค่าที่เลือก */}
      <CheckboxGroup
        headname="เลือกประเภท"
        names={names}
      />

      {children}
    </div>
  );
}
