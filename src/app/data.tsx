import { Subject } from "@/hooks/useAbility"
import {
  DashboardOutlined,
  InboxOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons"
import { lazy, ReactElement } from "react"

const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"))
const Supplier = lazy(() => import("@/pages/supplier/Supplier"))
const Medicine = lazy(() => import("@/pages/medicine/MedicineContext"))

type TRouteData = {
  key: string
  subject?: Subject
  index?: boolean
  icon?: ReactElement
  label: string
  path?: string
  element: ReactElement
}

export const RouterData: TRouteData[] = [
  {
    key: "/",
    index: true,
    label: "Dashboard",
    icon: <DashboardOutlined />,
    element: <Dashboard />,
  },
  {
    key: "/supplier",
    path: "/supplier",
    label: "Supplier",
    subject: "supplier",
    icon: <InboxOutlined />,
    element: <Supplier />,
  },
  {
    key: "/medicine",
    path: "/medicine",
    label: "Medicine",
    subject: "medicine",
    icon: <MedicineBoxOutlined />,
    element: <Medicine />,
  },
]
