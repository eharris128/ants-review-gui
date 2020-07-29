import React from "react";

import { Menu } from "antd";
import {
  DashboardOutlined,
  ContainerOutlined,
  EditOutlined,
} from "@ant-design/icons";
const { SubMenu } = Menu;

class Sider extends React.Component {
  handleClick = (e) => {
    console.log("click ", e);
  };

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
      >
        <SubMenu icon={<ContainerOutlined />} key="sub1" title="Authors">
          <Menu.Item icon={<DashboardOutlined />} key="1">
            Dashboard
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <>
              <EditOutlined />
              <span>
                <span>Peer Reviewers</span>
              </span>
            </>
          }
        >
          <Menu.Item icon={<DashboardOutlined />} key="2">
            Dashboard
          </Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

export default Sider;
