import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Delete from "./svg/Delete";
interface UserComment {
  id: string;
  email: string;
  message: string;
  movie_id: string;
  timestamp: string; // หรือประเภทวันที่ที่คุณต้องการ
}

function GetcommentUser({ comment }: { comment: any }) {
  const comments =comment.commentuser;
  console.log(comment.commentuser);
  const { data: session } = useSession();
  const [userdata, setuserdata] = useState<UserComment[]>(comments);
  const [editState, setEditState] = useState<boolean[]>(
    Array(comments.length).fill(false)
  );
  const [messageState, setmessageState] = useState<string[]>(
    Array(comments.length).fill("")
  );

  const email = session?.user?.email;
  const token = session?.user?.token;
  const deletecomment = async (_id: any) => {
    const dataToStore = { email, _id, token };
    const response = await fetch("/api/submit/deletecomment", {
      method: "POST",
      body: JSON.stringify(dataToStore),
    });
    if (!response.ok) {
      console.error("api fail");
    } else {
      alert("success");
      const newdata = userdata.filter((item:any)=>item._id!==_id);
      setuserdata(newdata);
      // const data = await response.json();
      // setuserdata(data.filteruser);
      // console.log(data);
      // window.location.reload();
    }
  };
  const setEditStateIndex = (index: number) => {
    setEditState((prev) =>
      prev.map((item, idx) => (idx === index ? !item : item))
    );
  };
  const setMessageStateIndex = (index: number, newMessage: string) => {
    setmessageState((prev) =>
      prev.map((item, idx) => (idx === index ? newMessage : item))
    );
  };
  const updateUserMessage = (index: number, newMessage: string) => {
    setuserdata((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          return { ...item, message: newMessage }; // อัปเดต message ของ item
        }
        return item; // คืนค่าของ item ที่ไม่ถูกอัปเดต
      })
    );
  };

  const Submit = async (index: number, id: number) => {
    const message = messageState[index];
    const dataToStore = { email, id: id, token, message };
    const response = await fetch("/api/submit/editcomment", {
      method: "POST",
      body: JSON.stringify(dataToStore),
    });
    if (!response.ok) {
      console.error("api fail");
    }
    setEditStateIndex(index);
    updateUserMessage(index, message);
    alert("success");
  };
  useEffect(() => {
    console.log(userdata);
  }, []);

  return (
    <Container>
      
      {userdata.length>0 ? (
        <>
          <div className="text-3xl font-bold text-center mt-14 mb-8">
            User Comment
          </div>
          {userdata.map((item: any, index: number) => {
            // const dateOnly = new Date(item.timestamp).toISOString().split("T")[0];
            // const timeOnly = new Date(item.timestamp)
            //   .toISOString()
            //   .split("T")[1]
            //   .split(".")[0];
            // const email = session?.user?.email;
            // const token = session?.user?.name;
            // const [edit, setedit] = useState(false);
            // const [message, setmessage] = useState(item.message);
            // const dataToStore = { email, id: item.id, token, message };
            // const Submit = async () => {
            //   const response = await fetch("/api/submit/editcomment", {
            //     method: "POST",
            //     body: JSON.stringify(dataToStore),
            //   });
            //   if (!response.ok) {
            //     console.error("api fail");
            //   }
            //   setedit(!edit);
            //   alert("success");
            // };
            // const deletecomment = async () => {
            //   const dataToStore = { email, id: item.id, token };
            //   const response = await fetch("/api/submit/deletecomment", {
            //     method: "POST",
            //     body: JSON.stringify(dataToStore),
            //   });
            //   if (!response.ok) {
            //     console.error("api fail");

            //   } else {
            //     alert("success");
            //     userdata.pop()
            //     const data =JSON.parse(JSON.stringify(userdata))
            //     setuserdata(data);
            //     console.log(data);
            //     // window.location.reload();
            //   }
            // };
            return (
              <div
                className="flexbase p-5 border-2 rounded-2xl mb-2 mt-2 "
                key={"comment" + item.id}
              >
                <div className=" basis-2/5">
                  <div className="text-xl">{item.email}</div>
                  {!editState[index] ? (
                    <div
                      className="basis-4/5 cursor-pointer"
                      onClick={() => setEditStateIndex(index)}
                    >
                      message : {item.message} <div>(Click message to edit)</div>
                    </div>
                  ) : (
                    <>
                      <div className="">
                        <input
                          onChange={(e) =>
                            setMessageStateIndex(index, e.target.value)
                          }
                          placeholder="ใส่ message ใหม่ที่นี่"
                        ></input>
                        <button
                          className="btn"
                          onClick={() => Submit(index, item.id)}
                        >
                          submit
                        </button>
                        <button
                          className="btn"
                          onClick={() => setEditStateIndex(index)}
                        >
                          back
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <a className=" basis-1/5 " href={"/movie/" + item.movie_id}>
                  รหัสหนัง : {item.movie_id} || comment_id : {item.id}
                </a>

                <div className=" basis-1/5">{/* {dateOnly} {timeOnly} */}</div>
                <div className="basis-1/5">
                  <div
                    className="rounded-full card h-14 cursor-pointer w-14 "
                    onClick={() => deletecomment(item._id)}
                  >
                    <Delete />
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default GetcommentUser;
