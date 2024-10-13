import { atomApp } from "@/states/app"
import { LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons"
import { useKeycloak } from "@react-keycloak/web"
import { Dropdown, Flex, Layout, Typography } from "antd"
import { useAtomValue } from "jotai"
import { useCookies } from "react-cookie"

const AppHeader = () => {
  const appState = useAtomValue(atomApp)
  const { keycloak } = useKeycloak()
  const [_cookies, _setCookie, removeCookie] = useCookies(["token"])

  const handleLogout = () => {
    keycloak.logout()
    removeCookie("token")
  }

  return (
    <Layout.Header className="h-[64px] bg-[#4096ff] px-6">
      <Flex align="center" justify="space-between" className="h-full">
        <Typography.Title level={3} className="text-white m-0">
          {appState.headerText}
        </Typography.Title>
        <Dropdown
          menu={{
            items: [
              {
                key: "email",
                label: keycloak.tokenParsed?.name || "",
                className: "pointer-events-none",
              },
              {
                type: "divider",
              },
              {
                key: "change-password",
                label: "Change Password",
                icon: <LockOutlined />,
              },
              {
                key: "logout",
                label: "Logout",
                icon: <LogoutOutlined />,
                onClick: handleLogout,
              },
            ],
          }}
        >
          <UserOutlined className="text-[28px] text-white" />
        </Dropdown>
      </Flex>
    </Layout.Header>
  )
}

export default AppHeader
