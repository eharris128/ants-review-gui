import React, { useState } from "react";

import AntReviewForm from "./AntReviewForm";
import "./index.css";

const sendIssueTx = async (web3, antsReviewInstance, accounts, antReview) => {
  const { ipfsHash, ethRewardAmount, dueDate } = antReview;
  // const issueAntReviewPayload = {
  //   _approver: [accounts],
  //   _issuers: accounts,
  //   _paperHash: ipfsHash,
  //   _requirementsHash: ipfsHash,
  //   _deadline: dueDate,
  // };
  await antsReviewInstance.methods
    .issueAntReview([accounts], accounts, ipfsHash, ipfsHash, dueDate)
    .send({
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
    try {
      await sendIssueTx(web3, antsReviewInstance, accounts, newAntReview);
    } catch (e) {
      console.error("Failed to send issue tx ", e);
    }
  }
  return (
    <div className="issueAntReview">
      <h2>Issue New AntReview</h2>
      <AntReviewForm antReview={antReview} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default IssueAntReview;
