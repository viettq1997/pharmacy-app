import { Layout, Spin } from "antd"
import { Suspense } from "react"
import { Outlet } from "react-router-dom"

const AppContent = () => {
  return (
    <Layout.Content className="min-h-[120px]">
      <Suspense fallback={<Spin spinning size="large" />}>
        <Outlet />
      </Suspense>
    </Layout.Content>
  )
}

export default AppContent
