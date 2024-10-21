"use client";

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
  const {
    genre,
    releaseYear,
    setGenre,
    setReleaseYear,
    selectedRole,
    setSelectedRole,
    bools,
    setBools,
    endYear,
    setEndYear,
    setStartYear,
    startYear,
  } = useMovieContext();

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

  const setBoolIndex = (index: number) => {
    const [bool1,setbool1]=useState<boolean[]>(bools)
    setbool1((prevBools:boolean[]) => 
        prevBools.map((bool, i) => (i === index ? !bool : bool))
    );
    setBools(bool1);
  };
  
  
  useEffect(() => {
    const selectedIds = ids.filter((id, index) => bools[index]);
    console.log("Selected IDs:", selectedIds);
    if (selectedRole === "Or") {
      const stringIDs = selectedIds.join("|");
      setGenre(stringIDs);
      console.log(genre);
    } else {
      const stringIDs = selectedIds.join(",");
      setGenre(stringIDs);
      console.log(genre);
    }
    sessionStorage.setItem("bools", JSON.stringify(bools));
    sessionStorage.setItem("selectedRole", selectedRole);
  }, [bools, selectedRole]);
  useEffect(() => {
    sessionStorage.setItem("startYear", startYear);
  }, [startYear]);

  useEffect(() => {
    sessionStorage.setItem("endYear", endYear);
  }, [endYear]);
  const setBoolFunctions = names.map((_, index) => () => setBoolIndex(index));

  // สถานะสำหรับปีเริ่มต้นและปีสิ้นสุด

  // รายการปี
  const years = ["2020", "2021", "2022", "2023", "2024"];

  return (
    <div className="container mt-32 mx-auto">
      <Radio
        headname="เลือกเงื่อนไขการแสดงผล"
        radios={roles}
        selectedValue={selectedRole}
        onChange={handleRoleChange}
      />
      <CheckboxGroup headname="เลือกประเภท" names={names} />
      <div className="flexbase">
        <div className="me-8 text-2xl">เลือกปีที่จะเริ่มต้นการค้นหา</div>
        <select
          id="startYear"
          value={startYear}
          onChange={(e) => {
            setStartYear(e.target.value);
            setEndYear(e.target.value); // ตั้งปีสิ้นสุดให้ตรงกับปีเริ่มต้นเมื่อเลือก
          }}
          className="basis-1/4 bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="ms-28 me-8 text-2xl">เลือกปีที่จะสิ้นสุดการค้นหา</div>
        <select
          id="endYear"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="basis-1/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          disabled={!startYear} // ปิดการใช้งานเมื่อยังไม่มีปีเริ่มต้น
        >
          
          {years
            .filter((year) => parseInt(year) >= parseInt(startYear)) // กรองปีสิ้นสุดที่มากกว่าหรือเท่ากับปีเริ่มต้น
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>

      {children}
    </div>
  );
}
