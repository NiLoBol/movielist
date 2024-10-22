"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define the type for the context state
interface MovieContextType {
  genre: string;
  releaseYear: string;
  setGenre: (genre: string) => void;
  setReleaseYear: (year: string) => void;
  bools: boolean[];
  setBools: (bools: boolean[]) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  startYear: string; // เพิ่มปีเริ่มต้น
  setStartYear: (year: string) => void; // เพิ่มฟังก์ชันการตั้งค่า
  endYear: string; // เพิ่มปีสิ้นสุด
  setEndYear: (year: string) => void; // เพิ่มฟังก์ชันการตั้งค่า
}

// Create the context with default values
const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Define a provider component
export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [genre, setGenre] = useState<string>("28"); // Default to Action
  const [releaseYear, setReleaseYear] = useState<string>("2022"); // Default year
  const [bools, setBools] = useState<boolean[]>(([]));
  const [selectedRole, setSelectedRole] = useState<string>(("Or"));
  const [startYear, setStartYear] = useState<string>(("2020"));

  const [endYear, setEndYear] = useState<string>(("2024"));
  useEffect(() => {
    const data = JSON.parse(
      sessionStorage.getItem("bools") || JSON.stringify(Array(16).fill(false))
    );
    setBools(data)
    const savedRole = sessionStorage.getItem("selectedRole");
    setSelectedRole(savedRole||"Or")
    const savedStartYear = sessionStorage.getItem("startYear");
    setStartYear(savedStartYear||"2020")
    const savedEndYear = sessionStorage.getItem("endYear");
    setEndYear(savedEndYear||"2024")
  }, [])
  
  return (
    <MovieContext.Provider
      value={{
        genre,
        releaseYear,
        setGenre,
        setReleaseYear,
        bools,
        setBools,
        selectedRole,
        setSelectedRole,
        startYear, // เพิ่มปีเริ่มต้น
        setStartYear, // เพิ่มฟังก์ชันการตั้งค่า
        endYear, // เพิ่มปีสิ้นสุด
        setEndYear, // เพิ่มฟังก์ชันการตั้งค่า
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

// Custom hook to use the context
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};
