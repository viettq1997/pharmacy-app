import router from "@/app/router"
import { ReactKeycloakProvider } from "@react-keycloak/web"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { App, ConfigProvider, Spin } from "antd"
import Keycloak from "keycloak-js"
import "mac-scrollbar/dist/mac-scrollbar.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"

const queryClient = new QueryClient()
const keycloakConfig = {
  url: "http://localhost:8080",
  realm: "pms-realm",
  clientId: "frontend-client",
}

const keycloak = new Keycloak(keycloakConfig)
createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: "check-sso",
    }}
  >
    <StrictMode>
      <ConfigProvider>
        <App
          notification={{
            duration: 3,
            maxCount: 3,
            pauseOnHover: true,
          }}
        >
          <QueryClientProvider client={queryClient}>
            <RouterProvider
              router={router}
              fallbackElement={<Spin fullscreen size="large" />}
            />
          </QueryClientProvider>
        </App>
      </ConfigProvider>
    </StrictMode>
  </ReactKeycloakProvider>
)
