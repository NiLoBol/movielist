"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

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
}

// Create the context with default values
const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Define a provider component
export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [genre, setGenre] = useState<string>("28"); // Default to Action
  const [releaseYear, setReleaseYear] = useState<string>("2022"); // Default year
  const [bools, setBools] = useState<boolean[]>(() => {
    const savedBools = sessionStorage.getItem("bools");
    return savedBools ? JSON.parse(savedBools) : Array(16).fill(false);
  });
  const [selectedRole, setSelectedRole] = useState<string>(() => {
    const savedRole = sessionStorage.getItem("selectedRole");
    return savedRole ? savedRole : "Or"; // Return savedRole if it exists, else "Or"
  });
  // Default value

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
