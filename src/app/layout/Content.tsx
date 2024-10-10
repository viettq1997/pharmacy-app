import { Layout } from "antd"
import { Outlet } from "react-router-dom"

const AppContent = () => {
  return (
    <Layout.Content className="min-h-[120px]">
      <Outlet />
    </Layout.Content>
  )
}

export default AppContent
