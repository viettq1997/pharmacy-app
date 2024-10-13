import {DashboardOutlined, InboxOutlined, UserOutlined} from "@ant-design/icons"
import { ItemType, MenuItemType } from "antd/es/menu/interface"
import { lazy } from "react"
import { RouteObject } from "react-router-dom"
import Employees from "@/pages/employee/Employees.tsx";

const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"))
const Supplier = lazy(() => import("@/pages/supplier/Supplier"))

export const RouterData: (RouteObject &
  ItemType<MenuItemType & { path?: string }>)[] = [
  {
		key: "/",
    index: true,
    icon: <DashboardOutlined />,
    label: "Dashboard",
    element: <Dashboard />,
  },
  {
    key: "/supplier",
    icon: <InboxOutlined />,
    label: "Supplier",
    path: "/supplier",
    element: <Supplier />,
  },
  {
    key: "/employee",
    icon: <UserOutlined />,
    label: "Employee",
    path: "/employee",
    element: <Employees />,
  },
]
