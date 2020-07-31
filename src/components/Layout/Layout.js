import React, { useState } from "react";

import { Layout } from "antd";
import Icon, { HeartOutlined } from "@ant-design/icons";

import { Header } from "../Header";
import { Sider } from "../Sider";
import { Dashboard } from "../Dashboard";
import "./index.css";

const AntReviewLayout = () => {
  const [collapsed, setCollapsed] = useState(null);
  const [selectedView, setSelectedView] = useState(null);

  const { Header: DesignHeader, Footer, Sider: DesignSider, Content } = Layout;
  const CustomHeart = (props) => <Icon component={HeartOutlined} {...props} />;

  const handleMenuClick = (selectedTabKey) => {
    setSelectedView(selectedTabKey);
  };

  const handleIssueClick = () => {
    setSelectedView("issueAntReview");
  };

  const setFulfillView = () => {
    setSelectedView('fulfillAntReview')
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DesignSider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <Sider
          currentDisplay={selectedView}
          handleMenuClick={handleMenuClick}
        />
      </DesignSider>
      <Layout className="site-layout">
        <DesignHeader className="site-layout-background" style={{ padding: 0 }}>
          <Header
            currentDisplay={selectedView}
            handleIssueClick={handleIssueClick}
          />
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
            <Dashboard
              setFulfillView={setFulfillView}
              currentDisplay={selectedView}
            />
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
