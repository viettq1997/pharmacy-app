import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons"
import { ItemType, MenuItemType } from "antd/es/menu/interface"

export const MenuItems: ItemType<MenuItemType & { path?: string }>[] = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: "nav 1",
    children: [
      {
        key: "1-1",
        label: "nav 1-1",
        path: "/nav1-1",
      },
    ],
  },
  {
    key: "2",
    icon: <VideoCameraOutlined />,
    label: "nav 2",
    path: "/nav2",
  },
  {
    key: "3",
    icon: <UploadOutlined />,
    label: "nav 3",
    path: "/nav2",
  },
  {
    key: "employee-management",
    icon: <UserOutlined />,
    label: "Employee",
    path: "/employee",
  },
]
