import router from "@/app/router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { App, ConfigProvider, Spin } from "antd"
import "mac-scrollbar/dist/mac-scrollbar.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
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
)
