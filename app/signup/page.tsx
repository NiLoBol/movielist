"use client";
import React, { useState } from "react";
import bcrypt from "bcryptjs";

function reset_input() {
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
    if (typeof password === "string") {
      const hashedPassword = bcrypt.hashSync(password, 10);
      // ... ทำงานต่อไปกับ hashedPassword
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: hashedPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // จัดการกับการตอบสนองถ้าจำเป็น
      const data = await response.json();
      if (data.message === "have User in sytem ") {
        alert("มีผู้ใช้ในระบบแล้ว");
      } else {
        alert("สมัครสมาชิกสำเร็จ");
      }
      
    } else {
      // จัดการกรณีที่ password เป็น null หรือไม่ได้ส่งค่า
      console.error("Password is required");
    }
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Flowbite
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              ลงทะเบียนบัญชีของคุณ
            </h1>
            <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
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
                  name="email" // เพิ่ม name ที่นี่
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  placeholder="name@flowbite.com"
                  required
                />
              </div>
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
                  name="password" // เพิ่ม name ที่นี่
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required
                />
              </div>
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
                  name="repeat-password" // เพิ่ม name ที่นี่
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
