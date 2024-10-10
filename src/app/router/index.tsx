import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
import AppLayout from "../layout"

const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
])
export default router
