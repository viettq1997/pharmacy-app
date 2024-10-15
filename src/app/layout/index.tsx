import { cn } from "@/utils/function"
import { useKeycloak } from "@react-keycloak/web"
import { Layout, Spin } from "antd"
import { useEffect } from "react"
import { useCookies } from "react-cookie"
import AppContent from "./Content"
import AppHeader from "./Header"
import AppSider from "./Sider"

const AppLayout = () => {
  const { keycloak, initialized } = useKeycloak()
  const [cookies, setCookie] = useCookies(["token"])

  useEffect(() => {
    setCookie("token", keycloak.token)
    console.log(keycloak)
    keycloak.loadUserInfo().then(console.log)
  }, [keycloak.token, cookies])

  return (
    <>
      {(!initialized || !keycloak.authenticated) && (
        <>
          <div
            className={cn("w-screen h-screen fixed top-0 left-0 bg-white z-40")}
          />
          <Spin
            spinning
            size="large"
            className="fixed top-[calc(50%-16px)] left-[calc(50%-16px)] z-50"
          />
        </>
      )}
      <Layout className={cn("w-screen h-screen")}>
        <AppSider />
        <Layout>
          <AppHeader />
          {initialized && keycloak.authenticated && <AppContent />}
        </Layout>
      </Layout>
    </>
  )
}
export default AppLayout
