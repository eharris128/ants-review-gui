import React, { useState } from "react";

import AntReviewForm from "./AntReviewForm";
import "./index.css";

const sendIssueTx = async (
  web3,
  antsReviewInstance,
  accounts,
  antReview
) => {
  const { ipfsHash, ethRewardAmount, dueDate } = antReview;

  await antsReviewInstance.methods.issueAntReview(ipfsHash, dueDate).send({
    from: accounts,
    value: web3.utils.toWei(ethRewardAmount.toString(), "ether"),
  });
};
const IssueAntReview = ({
  antReviewID,
  accounts,
  web3,
  antsReviewInstance,
}) => {

  const [antReview, setAntReview] = useState(null);
  async function handleFormSubmit(newAntReview) {
    setAntReview(newAntReview);
      await sendIssueTx(
        web3,
        antsReviewInstance,
        accounts,
        newAntReview
      );
  }
  return (
    <div className="issueAntReview">
      <h2>Issue New AntReview</h2>
      <AntReviewForm antReview={antReview} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default IssueAntReview;
