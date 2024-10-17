"use client";
import React, { useState } from "react";
import bcrypt from "bcryptjs";
/*{
ข้อมูลuser เก็บข้อมูลอย่างอื่นมาใช้ต่อ
}*/
function reset_input() {
  // ยังไม่ได้เพิ่ม
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const repeatPasswordInput = document.getElementById(
    "repeat-password"
  ) as HTMLInputElement;

  if (emailInput) emailInput.value = "";
  if (passwordInput) passwordInput.value = "";
  if (repeatPasswordInput) repeatPasswordInput.value = "";
}
export default function Signup() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  
    // สร้าง FormData ใหม่จากฟอร์ม
    const formData = new FormData(event.currentTarget);
  
    // แสดงค่าใน FormData เพื่อตรวจสอบว่าเต็มหรือไม่
    console.log(formData);
    
    const password = formData.get("password");
    const repeatPassword = formData.get("repeat-password");
  
    if (typeof password === "string" && typeof repeatPassword === "string") {
      if (password !== repeatPassword) {
        alert("รหัสผ่านไม่ตรงกัน");
        return;
      }
  
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      // ส่งข้อมูลลงทะเบียนไปยังเซิร์ฟเวอร์
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: hashedPassword,
          username: formData.get("username"),
          fullname: formData.get("fullname"),
          phonenumber: formData.get("phonenumber"),
          gender: formData.get("gender"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // จัดการกับการตอบสนองถ้าจำเป็น
      const data = await response.json();
      alert(data.message);
    } else {
      // จัดการกรณีที่ password หรือ repeat-password เป็น null หรือไม่ได้ส่งค่า
      console.error("Password is required");
    }
  }
  

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              ลงทะเบียนบัญชีของคุณ
            </h1>
            <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
              {/* username */}
              <div className="mb-5">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  placeholder="username"
                  required
                />
              </div>
              {/* fullname */}
              <div className="mb-5">
                <label
                  htmlFor="text"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  ชื่อเต็ม
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  placeholder="fullname"
                  required
                />
              </div>
              {/* phonenumber */}
              <div className="mb-5">
                <label
                  htmlFor="phonenumber"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  เบอร์มือถือ
                </label>
                <input
                  type="tel"
                  pattern="[0]{1}[0-9]{9}"
                  maxLength={10}
                  minLength={10}
                  id="phonenumber"
                  name="phonenumber"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  placeholder="phonenumber"
                  required
                />
              </div>
              {/* gender */}
              <div className="mb-5">
                <label
                  htmlFor="countries"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  เลือกเพศของคุณ
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option>ชาย</option>
                  <option>หญิง</option>
                </select>
              </div>
              {/* email */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  อีเมลของคุณ
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  placeholder="name@flowbite.com"
                  required
                />
              </div>
              {/* password */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  รหัสผ่านของคุณ
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required
                />
              </div>
              {/* repeat-password */}
              <div className="mb-5">
                <label
                  htmlFor="repeat-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  ยืนยันรหัสผ่าน
                </label>
                <input
                  type="password"
                  id="repeat-password"
                  name="repeat-password"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                ลงทะเบียนบัญชีใหม่
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
