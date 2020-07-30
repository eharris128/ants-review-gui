import React from "react";

import FulfillAntReviewForm from "./FulFillAntReviewForm";
import "./index.css";

const FulfillAntReview = ({ antReviewID, accounts, web3, antsReviewInstance }) => {
  const handleFormSubmit = async ({ ipfsHash }) => {
    
    await antsReviewInstance.methods.fulfillAntReview(antReviewID, ipfsHash).send({from: accounts});
  };
  return (
    <div className="fulfillAntReview">
      <h2>Fulfill AntReview</h2>
      <FulfillAntReviewForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default FulfillAntReview;
