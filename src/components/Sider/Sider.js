import React from "react";

import { Menu } from "antd";
import {
  DashboardOutlined,
  ContainerOutlined,
  EditOutlined,
} from "@ant-design/icons";
const { SubMenu } = Menu;

class Sider extends React.Component {
  handleClick = (e, handleMenuClick) => {
    const { key } = e;
    handleMenuClick(key);
  };

  render() {
    const { handleMenuClick } = this.props;

    return (
      <Menu
        onClick={(e) => this.handleClick(e, handleMenuClick)}
        defaultSelectedKeys={["1"]}
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
        </SubMenu>
      </Menu>
    );
  }
}

export default Sider;
