import React from "react";

import { PageHeader, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { IssueAntReview } from "../IssueAntReview";
import "./index.css";

function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Rewarding and Recognizing Quality Peer Review</h1>;
}

function Greeting(props) {
  const hasStartedIssueWorkflow = props.hasStartedIssueWorkflow;
  if (hasStartedIssueWorkflow) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

function GetStartedButton(props) {
  return (
    <Button onClick={props.onClick} size="large" type="primary">
      Get Started
    </Button>
  );
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleIssueAntReviewClick = this.handleIssueAntReviewClick.bind(this);
    // this.state = {hasStartedIssueWorkflow: false};
    this.state = { hasStartedIssueWorkflow: true };
  }

  handleIssueAntReviewClick() {
    this.setState({ hasStartedIssueWorkflow: true });
  }

  render() {
    const hasStartedIssueWorkflow = this.state.hasStartedIssueWorkflow;
    let workflow;
    if (hasStartedIssueWorkflow) {
      workflow = <IssueAntReview />;
    } else {
      workflow = <GetStartedButton onClick={this.handleIssueAntReviewClick} />;
    }
    return (
      <div>
        <PageHeader
          ghost={false}
          className="site-page-header"
          title="Ants-Review"
          extra={[
            <Button
              onClick={() => console.log("Start Issue AntReview Workflow")}
              icon={<PlusOutlined />}
              size="large"
              key="1"
              type="primary"
            >
              Issue AntReview
            </Button>,
          ]}
        />
        {/* <Greeting hasStartedIssueWorkflow={hasStartedIssueWorkflow} />
        {workflow} */}
      </div>
    );
  }
}

export default Header;
