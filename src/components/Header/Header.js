import React from "react";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import "./index.css";

const Header = ({ handleIssueClick }) => {
  return (
    <div>
      <Button
        onClick={() => handleIssueClick()}
        icon={<PlusOutlined />}
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
