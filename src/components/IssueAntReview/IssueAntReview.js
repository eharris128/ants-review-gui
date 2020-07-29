import React, { useState } from "react";

import useWeb3 from "./use-web3";
import AntReviewForm from "./AntReviewForm";
import "./index.css";

const canInteractWithContract = (
  web3Instance,
  networkID,
  antsReviewInstance,
  accounts
) => web3Instance && networkID && antsReviewInstance && accounts;

const sendIssueTx = async (
  web3,
  networkID,
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
const IssueAntReview = () => {
  const { web3, networkID, antsReviewInstance, accounts } = useWeb3();

  const [antReview, setAntReview] = useState(null);
  async function handleFormSubmit(newAntReview) {
    setAntReview(newAntReview);
    if (
      canInteractWithContract(web3, networkID, antsReviewInstance, accounts)
    ) {
      await sendIssueTx(
        web3,
        networkID,
        antsReviewInstance,
        accounts,
        newAntReview
      );
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
