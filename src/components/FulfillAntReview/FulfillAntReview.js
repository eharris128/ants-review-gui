import React from "react";

import FulfillAntReviewForm from "./FulFillAntReviewForm";
import "./index.css";

const filterAntReviews = (antReviews, cancelledAntReviews) => {
  return antReviews.filter((antReview) => {
    const { antReview_id: antReviewID } = antReview;

    const isAntReviewCancelled = cancelledAntReviews.find(
      (cancelledReview) => cancelledReview.antReview_id === antReviewID
    );
    return !isAntReviewCancelled;
  });
};
const FulfillAntReview = ({
  cancelledAntReviews,
  antReviews,
  antReviewID,
  accounts,
  web3,
  antsReviewInstance,
}) => {
  if (!antReviewID) {
    const fulfillableAntReviews = filterAntReviews(
      antReviews,
      cancelledAntReviews
    );
    const handleFormSubmit = async ({ ipfsHash, antReview }) => {
      try {
        await antsReviewInstance.methods
          .fulfillAntReview(antReview, ipfsHash)
          .send({ from: accounts });
      } catch (e) {
        console.error("Failed to send fulfill tx ", e);
      }
    };
    return (
      <div className="fulfillAntReview">
        <h2>Fulfill AntReview</h2>
        <FulfillAntReviewForm
          fulfillableAntReviews={fulfillableAntReviews}
          promptForAntReview={true}
          onSubmit={handleFormSubmit}
        />
      </div>
    );
  }

  const handleFormSubmit = async ({ ipfsHash }) => {
    try {
      await antsReviewInstance.methods
        .fulfillAntReview(antReviewID, ipfsHash)
        .send({ from: accounts });
    } catch (e) {
      console.error("Failed to send fulfill tx ", e);
    }
  };
  return (
    <div className="fulfillAntReview">
      <h2>Fulfill AntReview</h2>
      <FulfillAntReviewForm
        promptForAntReview={false}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default FulfillAntReview;
