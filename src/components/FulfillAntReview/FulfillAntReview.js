import React from "react";

import FulfillAntReviewForm from "./FulFillAntReviewForm";
import "./index.css";

const filterAntReviews = (antReviews, cancelledAntReviews) => {
  return antReviews.filter(antReview => {
    const {
      antReview_id: antReviewID,
    } = antReview;

    const isAntReviewCancelled = cancelledAntReviews.find(
      (cancelledReview) => cancelledReview.antReview_id === antReviewID
    );
    return !isAntReviewCancelled
  })
}
const FulfillAntReview = ({
  cancelledAntReviews,
  antReviews,
  antReviewID,
  accounts,
  web3,
  antsReviewInstance,
}) => {
  const fulfillableAntReviews = filterAntReviews(antReviews, cancelledAntReviews)

  if (!antReviewID) {
    const handleFormSubmit = async ({ ipfsHash, antReview }) => {
      console.log("handle form submit", antReview, ipfsHash)
      await antsReviewInstance.methods
        .fulfillAntReview(antReview, ipfsHash)
        .send({ from: accounts });
    };
    return (
      <div className="fulfillAntReview">
        <h2>Fulfill AntReview</h2>
        <FulfillAntReviewForm fulfillableAntReviews={fulfillableAntReviews} promptForAntReview={true} onSubmit={handleFormSubmit} />
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
