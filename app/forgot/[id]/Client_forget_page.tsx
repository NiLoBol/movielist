"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { set_newpassword } from "@/app/data/action/serversubmit";

function Client_forget_page({
  data,
  id,
  time,
}: {
  data: any;
  id: string;
  time: number;
}) {
  // สร้าง state เพื่อเก็บเวลาที่เหลือ
  if(time<0){
    redirect('/')
  }
  const [remainingTime, setRemainingTime] = useState(time);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // ตั้ง interval เพื่ออัปเดตเวลา
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1000) {
          redirect('/'); // เปลี่ยนเส้นทางไปยังหน้าอื่นเมื่อหมดเวลา
          return 0;
        }
        return prevTime - 1000; // ลดเวลา 1 วินาที (1000 milliseconds)
      });
    }, 1000); // อัปเดตทุก ๆ 1 วินาที

    // ล้าง interval เมื่อ component ถูก unmount
    return () => clearInterval(interval);
  }, []);

  // แปลง milliseconds เป็นนาทีและวินาที
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // หยุดการส่งฟอร์มปกติ

    // ตรวจสอบรหัสผ่านให้ตรงกัน
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    // ทำการส่งข้อมูลรหัสผ่านไปยัง API หรือจัดการอื่น ๆ ที่นี่
    console.log("Password changed:", password);
    set_newpassword(password,data.token);
    // redirect('/'); // สามารถทำการ redirect ไปยังหน้าที่ต้องการได้
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change your password
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password_confirm"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm your password
                </label>
                <input
                  type="password"
                  name="password_confirm"
                  id="password_confirm"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <div>
                เวลา: {formattedMinutes}:{formattedSeconds}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Client_forget_page;
