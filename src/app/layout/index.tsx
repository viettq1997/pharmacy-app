import { Layout } from "antd"
import AppContent from "./Content"
import AppHeader from "./Header"
import AppSider from "./Sider"

const AppLayout = () => {
  return (
    <Layout className="w-[calc(50% - 8px)] max-w-[calc(50% - 8px)] h-screen">
      <AppSider />
      <Layout>
        <AppHeader />
        <AppContent />
      </Layout>
    </Layout>
  )
}
export default AppLayout
