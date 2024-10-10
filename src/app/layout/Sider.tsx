import { cn } from "@/utils/function"
import { Layout, Menu, Typography } from "antd"
import { MacScrollbar } from "mac-scrollbar"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MenuItems } from "./data"

const AppSider = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleSelectMenu = (key: string) => {}

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width="350px"
      className="leading-[120px]"
    >
      <Typography.Title
        level={3}
        className={cn(
          "text-white text-center uppercase my-3",
          collapsed && "hidden"
        )}
      >
        Pharmacy
      </Typography.Title>
      <Typography.Title
        level={3}
        className={cn(
          "text-white text-center uppercase my-3",
          !collapsed && "hidden"
        )}
      >
        P
      </Typography.Title>
      <MacScrollbar>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={["1"]}
          defaultSelectedKeys={["1-1"]}
          onSelect={({ key }) => handleSelectMenu(key)}
          items={MenuItems}
        />
      </MacScrollbar>
    </Layout.Sider>
  )
}

export default AppSider
