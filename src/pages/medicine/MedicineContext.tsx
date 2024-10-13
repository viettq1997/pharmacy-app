import useApi from "@/hooks/useApi"
import { convertISODate } from "@/utils/function"
import { useQuery } from "@tanstack/react-query"
import { createContext, useEffect, useState } from "react"
import Medicine from "./Medicine"
import { TDataGetMedicine, TInfoContext } from "./Medicine.type"

const defaultInfo: TInfoContext = {
  data: [],
  total: 0,
  loading: true,
  setPage: () => {},
}

export const MedicineContext = createContext<TInfoContext>(defaultInfo)

const MedicineProvider = () => {
  const [page, setPage] = useState(1)
  const [info, setInfo] = useState<TInfoContext>({ ...defaultInfo, setPage })

  const { get } = useApi()
  const { data, isPending } = useQuery<TDataGetMedicine>({
    queryKey: ["getMedicine", page],
    queryFn: () => get("/medicines", { page: page - 1, size: 20 }),
  })

  useEffect(() => {
    if (isPending) setInfo((prev) => ({ ...prev, loading: true }))
    else if (data) {
      const newData = data.content.map((item) => ({
        ...item,
        createdDate: convertISODate(item.createdDate),
        updatedDate: convertISODate(item.updatedDate),
      }))
      setInfo((prev) => ({
        ...prev,
        data: newData,
        total: data.totalElement,
        loading: false,
      }))
    }
  }, [data, isPending])

  return (
    <MedicineContext.Provider value={info}>
      <Medicine />
    </MedicineContext.Provider>
  )
}

export default MedicineProvider
