import React from "react";

import { Typography, Card } from "antd";

import "./index.css";

const FulfillmentDetails = ({ fulfillment }) => {
  const { Title, Paragraph } = Typography;

  console.log("fulfillment", fulfillment);
  const { data: paperHash, fulfiller } = fulfillment;
  return (
    <div className="detailsContainer">
      <Title level={2}>Details</Title>
      <Card title={paperHash} style={{ width: 500, marginBottom: "2rem" }}>
        <Paragraph>Fulfiller - {fulfiller}</Paragraph>
      </Card>
    </div>
  );
};

export default FulfillmentDetails;
