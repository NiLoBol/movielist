import React from "react";
import ReportPage from "../components/ReportPage";
import Container from "../components/Container";

async function page() {
  return (
    <div className="mt-28 ">
      <Container>
        <ReportPage></ReportPage>
      </Container>
    </div>
  );
}

export default page;
