import React, { useState } from "react";

import { Skeleton, Typography, Card } from "antd";
// import { DollarCircleFilled } from "@ant-design/icons";

import weiToEth from "../../utils/weiToEth";

import "./index.css";

const PeerReviewerProfile = ({ acceptedAntReviews, accounts }) => {
  const { Title, Paragraph } = Typography;
  const displaySkeleton = () => (
    <Card style={{ width: 500, marginBottom: "2rem" }}>
      <Skeleton active />
    </Card>
  );

  const displayMyCompletedReviews = (myCompletedReviews) => {
    return myCompletedReviews.map((completedReview) => {
      const { issuer, amount: rewardAmount } = completedReview;
      return (
        <Card style={{ marginBottom: "2rem" }}>
          <p>Reward - {weiToEth(rewardAmount)} ETH</p>
          <p>Author - {issuer}</p>
        </Card>
      );
    });
  };
  const myCompletedReviews = acceptedAntReviews.filter(
    (fulfillment) => fulfillment.fulfiller === accounts
  );
  let totalEthEarned = 0;
  myCompletedReviews.forEach(
    (completedReview) => (totalEthEarned += weiToEth(completedReview.amount))
  );
  return (
    <>
      <div className="profileContainer">
        <div>
          <Title level={2}>My Stats</Title>
          <div className="rewardsContainer">
            <Paragraph>
              Total ETH Earned: {totalEthEarned.toFixed(4)}{" "}
            </Paragraph>
            {/* Need External API to convert to dollars */}
            {/* <DollarCircleFilled
              style={{ fontSize: "30px", color: "#5B8C00" }}
            /> */}
          </div>
        </div>
        <div>
          {/* Completed Reviews == fulfilled && paid out reviews */}
          <Title level={2}>My Completed AntReviews</Title>
          {myCompletedReviews.length
            ? displayMyCompletedReviews(myCompletedReviews)
            : displaySkeleton()}
        </div>
      </div>
    </>
  );
};

export default PeerReviewerProfile;
