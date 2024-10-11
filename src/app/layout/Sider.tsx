import { cn } from "@/utils/function"
import { Layout, Menu, Typography } from "antd"
import { MacScrollbar } from "mac-scrollbar"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { RouterData } from "../data"

const AppSider = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [currentLocation, setCurrentLocation] = useState("/")
  const location = useLocation()
  const navigate = useNavigate()

  const handleSelectMenu = (key: string) => {
    setCurrentLocation(key)
    navigate(key)
  }

  useEffect(() => {
    if (location.pathname !== currentLocation)
      setCurrentLocation(location.pathname)
  }, [location])

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
          defaultOpenKeys={[]}
          defaultSelectedKeys={[currentLocation]}
          onSelect={({ key }) => handleSelectMenu(key)}
          items={RouterData.map((item) => {
            const { index, ...rest } = item
            return rest
          })}
        />
      </MacScrollbar>
    </Layout.Sider>
  )
}

export default AppSider
