import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Delete from "./svg/Delete";

function GetcommentUser({ comment }: { comment: any }) {
  console.log(comment.userdata);
  const { data: session } = useSession();
  return (
    <Container>
      <div className="text-3xl font-bold text-center mt-14 mb-8">
        User Comment
      </div>
      {comment.userdata ? (
        comment.userdata.map((item: any, index: number) => {
          const dateOnly = new Date(item.timestamp).toISOString().split("T")[0];
          const timeOnly = new Date(item.timestamp)
            .toISOString()
            .split("T")[1]
            .split(".")[0];
          const email = session?.user?.email;
          const token = session?.user?.name;
          const [edit, setedit] = useState(false);
          const [message, setmessage] = useState(item.message);
          const dataToStore = { email, id: item.id, token, message };
          const Submit = async () => {
            const response = await fetch("/api/submit/editcomment", {
              method: "POST",
              body: JSON.stringify(dataToStore),
            });
            if (!response.ok) {
              console.error("api fail");
            }
            setedit(!edit);
            alert("success");
          };
          const deletecomment = async () => {
            const dataToStore = { email, id: item.id, token };
            const response = await fetch("/api/submit/deletecomment", {
              method: "POST",
              body: JSON.stringify(dataToStore),
            });
            if (!response.ok) {
              console.error("api fail");
            } else {
              alert("success");
              window.location.reload();
            }
          };
          return (
            <div
              className="flexbase p-5 border-2 rounded-2xl mb-2 mt-2 "
              key={"comment" + item.id}
            >
              <div className=" basis-2/5">
                <div className="text-xl">{item.email}</div>
                {!edit ? (
                  <div
                    className="basis-4/5 cursor-pointer"
                    onClick={() => setedit(!edit)}
                  >
                    message : {message} (Click message to edit)
                  </div>
                ) : (
                  <>
                    <div className="">
                      <input
                        onChange={(e) => setmessage(e.target.value)}
                        placeholder="ใส่ message ใหม่ที่นี่"
                      ></input>
                      <button className="btn" onClick={() => Submit()}>
                        submit
                      </button>
                      <button className="btn" onClick={() => setedit(!edit)}>
                        back
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className=" basis-1/5 ">
                รหัสหนัง : {item.movie_id} || comment_id : {item.id}
              </div>

              <div className=" basis-1/5">
                {dateOnly} {timeOnly}
              </div>
              <div className="basis-1/5">
                <div
                  className="rounded-full card h-14 cursor-pointer w-14 "
                  onClick={() => deletecomment()}
                >
                  <Delete />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </Container>
  );
}

export default GetcommentUser;
