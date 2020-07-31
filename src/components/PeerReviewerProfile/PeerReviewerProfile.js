import React from "react";

import { Skeleton, Typography, Card, Table } from "antd";
// import { DollarCircleFilled } from "@ant-design/icons";

import isUserFulfiller from "../../utils/isUserFulfiller";
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
  const myCompletedReviews = isUserFulfiller(acceptedAntReviews, accounts);
  let totalEthEarned = 0;
  myCompletedReviews.forEach(
    (completedReview) => (totalEthEarned += weiToEth(completedReview.amount))
  );

  const statsTableData = [
    {
      key: "1",
      totalEthEarned: totalEthEarned.toFixed(4),
      totalAntReviewsCompleted: myCompletedReviews.length,
    },
  ];

  const columns = [
    {
      title: "Total ETH Earned",
      dataIndex: "totalEthEarned",
      key: "totalEthEarned",
    },
    {
      title: "Total AntReviews Completed",
      dataIndex: "totalAntReviewsCompleted",
      key: "totalAntReviewsCompleted",
    },
  ];

  return (
    <>
      <div className="profileContainer">
        <div>
          <Title level={2}>My Stats</Title>
          <div className="rewardsContainer">
            <Table
              dataSource={statsTableData}
              columns={columns}
              pagination={false}
            />
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
