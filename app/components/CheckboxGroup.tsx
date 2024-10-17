import React from "react";

type CheckboxGroupProps = {
  headname: string;
  names: string[];
  setBool: ((index: number) => void)[];
};

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  names,
  setBool,
  headname,
}) => {
  return (
    <div>
      <h1 className="text-3xl text-gray-800 font-medium">{headname}</h1>
      <div className="flexbase py-3">
      {names.map((name, index) => (
        <label key={index} className=" text-gray-700 font-medium text-2xl basis-1/6" >
          <input
            type="checkbox"
            className=" border-gray-400 text-indigo-600 focus:ring-indigo-600 duration-150 w-6 h-6 my-3"
            onChange={() => setBool[index](index)}
          />
          {name}
        </label>
      ))}
    </div>
    </div>
  );
};

export default CheckboxGroup;
