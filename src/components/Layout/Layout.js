import React from "react";

import { Layout } from "antd";
import { Header } from '../Header'
import { Sider } from '../Sider'

const { Header: DesignHeader, Footer, Sider: DesignSider, Content } = Layout;
const AntReviewLayout = () => {
  return (
    <Layout>
      <DesignSider>
          <Sider />
      </DesignSider>
      <Layout>
        <DesignHeader>
            <Header />
        </DesignHeader>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default AntReviewLayout;
