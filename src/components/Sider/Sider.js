import React from "react";

import { Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  UploadOutlined,
  ContainerOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
const { SubMenu } = Menu;

class Sider extends React.Component {
  handleClick = (e, handleMenuClick) => {
    const { key } = e;
    handleMenuClick(key);
  };

  render() {
    const { handleMenuClick, currentDisplay } = this.props;

    return (
      <Menu
        onClick={(e) => this.handleClick(e, handleMenuClick)}
        defaultSelectedKeys={["1"]}
        selectedKeys={currentDisplay}
        defaultOpenKeys={["sub1"]}
        mode="inline"
      >
        <SubMenu
          icon={<ContainerOutlined />}
          key="authorSubmenu"
          title="Authors"
        >
          <Menu.Item icon={<DashboardOutlined />} key="authorDashboard">
            Dashboard
          </Menu.Item>
          <Menu.Item icon={<PlusOutlined />} key="issueAntReview">
            Issue AntReview
          </Menu.Item>
          <Menu.Item icon={<UserOutlined />} key="authorProfile">
            Profile
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="peerReviewerSubmenu"
          title={
            <>
              <EditOutlined />
              <span>
                <span>Peer Reviewers</span>
              </span>
            </>
          }
        >
          <Menu.Item icon={<DashboardOutlined />} key="peerReviewerDashboard">
            Dashboard
          </Menu.Item>
          <Menu.Item icon={<UploadOutlined />} key="fulfillAntReview">
            Fulfill AntReview
          </Menu.Item>
          <Menu.Item icon={<UserOutlined />} key="peerReviewerProfile">
            Profile
          </Menu.Item>
        </SubMenu>
        <Menu.Item icon={<DashboardOutlined />} key="faucet">
          Faucet
        </Menu.Item>
      </Menu>
    );
  }
}

export default Sider;
