import React from "react";

function Report_Card(props: { title: string | number; head: string }) {
  return (
    <div className="basis-1/4 p-5">
      <div className="text-center mb-20 text-4xl font-bold border-2 p-5 rounded-2xl">
        <div className="text-3xl">{props.head}</div>
        <div className="text-xl">{props.title}</div>
      </div>
    </div>
  );
}

export default Report_Card;
