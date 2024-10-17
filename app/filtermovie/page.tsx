"use client";
import React, { useEffect, useState } from "react";
import Radio from "../components/Radio";
import CheckboxGroup from "../components/CheckboxGroup";
// ถ้าดึงลงตรงนี้ ต้องเปลียนเป็น
function page() {
  const [selectedRole, setSelectedRole] = useState<string>("Or"); // ค่าเริ่มต้น

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
  };

  const roles = ["Or","And"]; // ประเภทอื่น ๆ


  const names = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"];
  const ids = [28, 12, 16, 35, 80, 99, 18, 14, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37]

  const [bools, setBools] = useState(Array(names.length).fill(false));

  const setBoolIndex = (index: number) => {
    setBools((prevBools) =>
      prevBools.map((bool, i) => (i === index ? !bool : bool))
    );
  };
  useEffect(() => {   
    const selectedIds = ids.filter((id, index) => bools[index]);
    console.log("Selected IDs:", selectedIds);
    if(selectedRole =="Or"){
        const stringIDs = selectedIds.map((item) => item).join("|");
        console.log(stringIDs);
        
    }else{
        const stringIDs = selectedIds.map((item) => item).join(",");
        console.log(stringIDs);
        
    }
  }, [bools,selectedRole])
  
  const setBoolFunctions = names.map((_, index) => () => setBoolIndex(index));
  return (
    <div className="container mt-32 mx-auto">
      <Radio
        headname="เลือกเงื่อนไขการแสดงผล"
        radios={roles}
        selectedValue={selectedRole}
        onChange={handleRoleChange}
      />
      <p className="mt-4">Selected role from parent: {selectedRole}</p>{" "}
      {/* แสดงค่าที่เลือก */}
      <CheckboxGroup headname="เลือกประเภท" names={names} setBool={setBoolFunctions} />

    </div>
  );
}

export default page;
