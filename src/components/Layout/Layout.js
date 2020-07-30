import React, { useState } from "react";

import { Layout } from "antd";
import Icon, { HeartOutlined } from "@ant-design/icons";

import { Header } from "../Header";
import { Sider } from "../Sider";
import { Dashboard } from "../Dashboard";
import "./index.css";

const AntReviewLayout = () => {
  const [collapsed, setCollapsed] = useState(null);
  const [displayIssueAntReviewView, setDisplayIssueAntReviewView] = useState(
    false
  );

  const { Header: DesignHeader, Footer, Sider: DesignSider, Content } = Layout;
  const CustomHeart = (props) => <Icon component={HeartOutlined} {...props} />;

  const handleMenuClick = (event) => {
    console.log("menu click handler stub", event);
  };

  const handleIssueClick = () => {
    setDisplayIssueAntReviewView(true);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DesignSider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <Sider handleMenuClick={handleMenuClick} />
      </DesignSider>
      <Layout className="site-layout">
        <DesignHeader className="site-layout-background" style={{ padding: 0 }}>
          <Header handleIssueClick={handleIssueClick} />
        </DesignHeader>
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
              display: "flex",
              flexFlow: "row nowrap",
              justifyContent: "space-around",
            }}
          >
            <Dashboard displayIssueAntReviewView={displayIssueAntReviewView} />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Made with <CustomHeart style={{ color: "#EB2F96" }} /> from France,
          England and the USA
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AntReviewLayout;
