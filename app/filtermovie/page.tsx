"use client";
import React, { useEffect, useState } from "react";
import Radio from "../components/Radio";
import CheckboxGroup from "../components/CheckboxGroup";
import { fetchMovies } from "../data/action/serversubmit";
import MovieCard from "../components/MovieCard";
// ถ้าดึงลงตรงนี้ ต้องเปลียนเป็น
function page() {
  const [selectedRole, setSelectedRole] = useState<string>("Or"); // ค่าเริ่มต้น
  const [data, setData] = useState<any>(null);
  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
  };

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

  const [bools, setBools] = useState(Array(names.length).fill(false));

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
      console.log(stringIDs);
      const res = async () => {
        const data = await fetchMovies(1, stringIDs, "2024");
        console.log(data);
        setData(data);
      };
      res();
    } else {
      const stringIDs = selectedIds.map((item) => item).join(",");
      console.log(stringIDs);
      const res = async () => {
        const data = await fetchMovies(1, stringIDs, "2024");
        console.log(data);
        setData(data);
      };
      res();
    }
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
        setBool={setBoolFunctions}
      />
      <div className="flexbase mt-28">
        {data ? (
          data.results.map((movie: any, index: number) => (
            <div className="basis-1/5 p-3" key={"m" + index}>
              <MovieCard key={"movielovecard-" + movie.id} movie={movie} />
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default page;
