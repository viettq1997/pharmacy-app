import { useKeycloak } from "@react-keycloak/web"
import { Layout, Spin } from "antd"
import AppContent from "./Content"
import AppHeader from "./Header"
import AppSider from "./Sider"

const AppLayout = () => {
  const keyCloak = useKeycloak()
  return (
    <Spin spinning={!keyCloak.initialized}>
      <Layout className="w-[calc(50% - 8px)] max-w-[calc(50% - 8px)] h-screen">
        <AppSider />
        <Layout>
          <AppHeader />
          <AppContent />
        </Layout>
      </Layout>
    </Spin>
  )
}
export default AppLayout
