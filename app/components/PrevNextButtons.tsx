"use client";
import { useRouter } from "next/router";
import React from "react";

function PrevNextButtons(props: { id: string }) {
  console.log(props.id);
  const handleNext = () => {
    const nextId = parseInt(props.id) + 1; // แปลง id เป็นจำนวนเต็มแล้วเพิ่ม 1
    console.log(nextId);

    window.location.href = "/" + nextId;
  };
  const handlePrevious = () => {
    const nextId = parseInt(props.id) - 1; // แปลง id เป็นจำนวนเต็มแล้วเพิ่ม 1
    console.log(nextId);
    window.location.href = "/" + nextId;
  };
  return (
    <div className="flexbase justify-between flex-row-reverse my-20 px-4">
      <button className="btn w-32" onClick={handleNext}>
        Next
      </button>
      {props.id != "1" ? (
        <button className="btn w-32" onClick={handlePrevious}>
          Previous
        </button>
      ) : (
        <button className="btn w-32 hidden" onClick={handlePrevious}>
          Previous
        </button>
      )}
    </div>
  );
}

export default PrevNextButtons;
