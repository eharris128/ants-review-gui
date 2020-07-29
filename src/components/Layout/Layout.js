import React, { useState } from "react";

import { Layout } from "antd";
// import { Layout, Typography } from "antd";

import Icon, { HeartOutlined} from "@ant-design/icons";

import { Header } from "../Header";
import { Sider } from "../Sider";
import "./index.css";
// const { Title } = Typography;

const AntReviewLayout = () => {
  
  const [collapsed, setCollapsed] = useState(null);
  const { Header: DesignHeader, Footer, Sider: DesignSider, Content } = Layout;
  const CustomHeart = props => <Icon component={HeartOutlined} {...props} />
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DesignSider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        {/* <Title className="ants-review-header" level={2}>
          Ants-Review
        </Title> */}
        <Sider />
      </DesignSider>
      <Layout className="site-layout">
        <DesignHeader className="site-layout-background" style={{ padding: 0 }}>
          <Header />
        </DesignHeader>
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            Some Starter Text.
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
