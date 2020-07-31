import React from "react";

import { Card, Typography } from "antd";
import weiToEth from "../../utils/weiToEth";

import "./index.css";

const AntReviewDetailView = ({ antReview }) => {
  const { Title, Paragraph } = Typography;

  console.log("antReview", antReview);
  const { data: paperHash, amount: rewardAmount, issuer } = antReview;
  return (
    <div className="detailsContainer">
      <Title level={2}>Details</Title>
      <Card title={paperHash} style={{ width: 500, marginBottom: "2rem" }}>
        <Paragraph>Reward - {weiToEth(rewardAmount)} ETH</Paragraph>
        <Paragraph>Author - {issuer}</Paragraph>
      </Card>
      </div>
  );
};

export default AntReviewDetailView;
