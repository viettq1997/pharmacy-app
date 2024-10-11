import { createBrowserRouter } from "react-router-dom"
import { RouterData } from "../data"
import AppLayout from "../layout"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: RouterData.map((item) => {
      return item
    }),
  },
])
export default router
