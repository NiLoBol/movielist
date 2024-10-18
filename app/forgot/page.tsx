"use client"
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { severtests } from '../data/action/serversubmit';

interface PasswordResetRequest {
  email: string;
  token: string;
  expiry: number;
}

const createPasswordResetRequest = (email: string): PasswordResetRequest => {
  const token = generateToken();
  const expiry = Date.now() + 10 * 60 * 1000; // เวลาหมดอายุ 10 นาทีใน milliseconds
// const expiry = Date.now()
  return {
    email,
    token,
    expiry,
  };
};

const generateToken = (): string => {
  return Math.random().toString(36).substring(2);
};

function Page() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newForgetData = createPasswordResetRequest(email);
    console.log(newForgetData);
    severtests(newForgetData)
    // try {
        
    //   const response = await emailjs.send(
    //     process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    //     process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    //     {
    //         from_name: "Movielist",
    //         to_name: "username", // put your name here.
    //         from_email: "sathaporn.e@wris.com",
    //         to_email: email, //put your email here.
    //         message: "click to go link",
    //         link:`http://localhost:3000/forgot/${newForgetData.token}`
    //       },
    //     process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
    //   );
    //   console.log('Email sent successfully!', response.status, response.text);
    //   alert('Email sent successfully!');
    // } catch (error) {
    //   console.error('Failed to send email:', error);
    //   alert('Failed to send email. Please try again.');
    // }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot Password
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleForgot}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
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

export default Page;
