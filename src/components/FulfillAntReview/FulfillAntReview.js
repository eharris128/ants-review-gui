import React from "react";

// import { Button } from "antd";
import FulfillAntReviewForm from "./FulFillAntReviewForm";
import "./index.css";

const FulfillAntReview = ({ antReviewID }) => {
  const handleFormSubmit = (fulfilledAntReview) => {
    console.log("fulfilledAntReview", fulfilledAntReview);
    console.log("antReviewID to submit with - ", antReviewID)
  };
  return (
    <div className="fulfillAntReview">
      <h2>Fulfill AntReview</h2>
      <FulfillAntReviewForm onSubmit={handleFormSubmit}/>
      {/* <Button
          onClick={() => console.log("Start Fulfill AntReview Workflow")}
          size="large"
          key="1"
          type="primary"
        >
          Fulfill AntReview
        </Button> */}
    </div>
  );
};

export default FulfillAntReview;