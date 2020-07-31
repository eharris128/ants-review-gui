import React from "react";

import FulfillAntReviewForm from "./FulFillAntReviewForm";
import "./index.css";

const FulfillAntReview = ({
  antReviewID,
  accounts,
  web3,
  antsReviewInstance,
}) => {
  if (!antReviewID) {
    const handleFormSubmit = async ({ ipfsHash }) => {
      await antsReviewInstance.methods
        .fulfillAntReview(antReviewID, ipfsHash)
        .send({ from: accounts });
    };
    return (
      <div className="fulfillAntReview">
        <h2>Fulfill AntReview</h2>
        <FulfillAntReviewForm promptForAntReview={true} onSubmit={handleFormSubmit} />
      </div>
    );
  }

  const handleFormSubmit = async ({ ipfsHash }) => {
    await antsReviewInstance.methods
      .fulfillAntReview(antReviewID, ipfsHash)
      .send({ from: accounts });
  };
  return (
    <div className="fulfillAntReview">
      <h2>Fulfill AntReview</h2>
      <FulfillAntReviewForm promptForAntReview={false} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default FulfillAntReview;
