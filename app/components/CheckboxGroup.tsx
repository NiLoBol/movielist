import React from "react";
import { useMovieContext } from "./context/MovieContext";

type CheckboxGroupProps = {
  headname: string;
  names: string[];
};

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  names,
  headname,
}) => {
  const { bools, setBools } = useMovieContext(); // ดึง bools และ setBools จาก context
  return (
    <div>
      <h1 className="text-3xl text-gray-800 font-medium">{headname}</h1>
      <div className="flexbase py-3">
        {names.map((name, index) => (
          <label key={index} className="text-gray-700 font-medium text-2xl basis-1/6">
            <input
              type="checkbox"
              checked={bools[index]} 
              className="border-gray-400 text-indigo-600 focus:ring-indigo-600 duration-150 w-6 h-6 my-3"
              onChange={() => {
                const newBools = [...bools];
                newBools[index] = !newBools[index]; // สลับค่า
                setBools(newBools); // อัปเดตค่าใหม่
              }}
            />
            {name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
