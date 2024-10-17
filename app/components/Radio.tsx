import React from "react";

interface RadioProps {
  radios: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  headname: string;
}

function Radio({ radios, selectedValue, onChange, headname }: RadioProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value); // ส่งค่ากลับไปยังฟังก์ชันใน Parent Component
  };

  return (
    <div>
      <h2 className="text-3xl text-gray-800 font-medium">{headname}</h2>
      <ul className="mt-3 space-y-3 ">
        {/* Radio groups */}
        {radios.map((item, idx) => (
          <li key={idx} className="flex items-center gap-x-2.5">
            <input
              type="radio"
              name="role"
              value={item}
              checked={selectedValue === item}
              onChange={handleChange}
              id={idx.toString()}
              className=" border-gray-400 text-indigo-600 focus:ring-indigo-600 duration-150 w-6 h-6"
            />
            <label
              htmlFor={idx.toString()}
              className=" text-gray-700 font-medium text-2xl"
            >
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Radio;
