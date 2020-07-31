import React from "react";

import { Skeleton, Typography, Card, Table } from "antd";
import weiToEth from "../../utils/weiToEth";
import isUserIssuer from "../../utils/isUserIssuer";

const AuthorProfile = ({ myAntReviews, acceptedAntReviews, accounts }) => {
  const { Title, Paragraph } = Typography;

  const displaySkeleton = () => (
    <Card style={{ width: 500, marginBottom: "2rem" }}>
      <Skeleton active />
    </Card>
  );
  const displayMyCompletedReviews = (myCompletedReviews) => {
    return myCompletedReviews.map((completedReview) => {
      const { fulfiller, amount: rewardAmount } = completedReview;
      return (
        <Card style={{ marginBottom: "2rem" }}>
          <p>Fulfiller - {fulfiller}</p>
          <p>Reward - {weiToEth(rewardAmount)} ETH</p>
        </Card>
      );
    });
  };
  let totalEthEarned = 0;
  const myCompletedReviews = isUserIssuer(acceptedAntReviews, accounts);

  myCompletedReviews.forEach(
    (completedReview) => (totalEthEarned += weiToEth(completedReview.amount))
  );

  const statsTableData = [
    {
      key: "1",
      totalAntReviewsIssued: myAntReviews.length,
      totalEthPaidOut: totalEthEarned.toFixed(4),
      totalAntReviewsCompleted: myCompletedReviews.length,
    },
  ];

  const columns = [
    {
      title: "Total AntReviews Issued",
      dataIndex: "totalAntReviewsIssued",
      key: "totalAntReviewsIssued",
    },
    {
      title: "Total ETH Paid Out",
      dataIndex: "totalEthPaidOut",
      key: "totalEthPaidOut",
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
          <div className="statsContainer">
            <Table
              dataSource={statsTableData}
              columns={columns}
              pagination={false}
            />
          </div>
        </div>
        <div>
          {/* Completed Reviews == fulfilled && paid out reviews */}
          <Title level={2}>Completed AntReviews</Title>
          {myCompletedReviews.length
            ? displayMyCompletedReviews(myCompletedReviews)
            : displaySkeleton()}
        </div>
      </div>
    </>
  );
};

export default AuthorProfile;
