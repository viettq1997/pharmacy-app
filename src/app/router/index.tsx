import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
import AppLayout from "../layout"
import EmployeeManagement from "@/pages/employee/EmployeeManagement.tsx";

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
      {
        path:'employee',
        index: true,
        element: <EmployeeManagement />,
      },
    ],
  },
])
export default router
