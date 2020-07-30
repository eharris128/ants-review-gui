import React from "react";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import "./index.css";

const Header = ({ handleIssueClick, currentDisplay }) => {
  const isOnIssueAntReviewView = currentDisplay === 'issueAntReview'
  return (
    <div>
      <Button
        onClick={() => handleIssueClick()}
        icon={<PlusOutlined />}
        disabled={isOnIssueAntReviewView}
        size="large"
        key="1"
        type="primary"
      >
        Issue AntReview
      </Button>
    </div>
  );
};

export default Header;
