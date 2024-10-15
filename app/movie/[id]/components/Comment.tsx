"use client";

import Container from "@/app/components/Container";

import { useSession } from "next-auth/react";
import React, { useState } from "react";

function Comment({ id }: { id: number }) {
  console.log(id);
  const { data: session } = useSession();
  const [message, setmessage] = useState("");
  async function Submit() {
    const email = session?.user?.email;
    const token = session?.user?.name;
    const dataToStore = { email, token, message, id };
    const response = await fetch("/api/submit/setcomment", {
      method: "POST",
      body: JSON.stringify(dataToStore),
    });
    if (!response.ok) {
      alert("fail api");
    } else {
      alert("success");
      window.location.reload();
    }
  }

  return (
    <Container>
      {session?.user ? (
        <div className="w-full mb-10">
          <label
            htmlFor="message"
            className="block mb-2 text-2xl font-medium text-gray-900 dark:text-white"
          >
            Your message
          </label>
          <textarea
            id="message"
            rows={4}
            onChange={(e) => setmessage(e.target.value)}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>
          <button
            className="btn mt-4 hover:bg-slate-100"
            onClick={() => Submit()}
          >
            submit
          </button>
        </div>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default Comment;
