import { Subject } from "@/hooks/useAbility"
import {
  DashboardOutlined,
  HddOutlined,
  InboxOutlined,
  MedicineBoxOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { lazy, ReactElement } from "react"

const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"))
const Supplier = lazy(() => import("@/pages/supplier/Supplier"))
const Medicine = lazy(() => import("@/pages/medicine/MedicineContext"))
const MedicineCategory = lazy(
  () => import("@/pages/medicineCategory/MedicineCategoryContext")
)
const Employees = lazy(() => import("@/pages/employee/Employees"))
const LocationRack = lazy(() => import("@/pages/locationRack/LocationRack"))
const PharmacyPOS = lazy(() => import("@/pages/pos/PharmacyPOS"))
const Customer = lazy(() => import("@/pages/customer/Customers"))
const Setting = lazy(() => import("@/pages/setting/Setting"))

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
  {
    key: "/medicine-category",
    path: "/medicine-category",
    label: "Medicine Category",
    subject: "medicineCategory",
    icon: <MedicineBoxOutlined />,
    element: <MedicineCategory />,
  },
  {
    key: "/employee",
    path: "/employee",
    label: "Employee",
    subject: "employee",
    icon: <UserOutlined />,
    element: <Employees />,
  },
  {
    key: "/pharmacy-pos",
    path: "/pharmacy-pos",
    label: "POS",
    subject: "pharmacy-pos",
    icon: <ShoppingCartOutlined />,
    element: <PharmacyPOS />,
  },
  {
    key: "/customer",
    path: "/customer",
    label: "Customer",
    subject: "customer",
    icon: <UsergroupAddOutlined />,
    element: <Customer />,
  },
  {
    key: "/locationRack",
    path: "/locationRack",
    label: "Location Rack",
    subject: "locationRack",
    icon: <HddOutlined />,
    element: <LocationRack />,
  },
  {
    key: "/setting",
    path: "/setting",
    label: "Setting",
    subject: "setting",
    icon: <SettingOutlined />,
    element: <Setting />,
  },
]
