import {
  CREATE_MEDICINE,
  DELETE_MEDICINE,
  GET_MEDICINES_PAGINATION,
  UPDATE_MEDICINE,
} from "@/api/medicine.api"
import { GET_MEDICINE_CATEGORIES_PAGINATION } from "@/api/medicineCategory.api"
import useApi from "@/hooks/useApi"
import { TFilter } from "@/types/CommonTypes"
import { convertISODate, objectIsEmpty } from "@/utils/function"
import { useMutation, useQuery } from "@tanstack/react-query"
import { App } from "antd"
import { createContext, useEffect, useState } from "react"
import { TDataGetMedicineCategory } from "../medicineCategory/MedicineCategory.type"
import Medicine from "./Medicine"
import { TDataGetMedicine, TInfoContext } from "./Medicine.type"

const defaultInfo: TInfoContext = {
  data: [],
  dataCategory: [],
  page: 1,
  total: 0,
  loading: true,
  loadingSubmit: false,
  setPage: () => {},
  onDelete: () => {},
  onSubmit: () => {},
  onSearch: () => {},
}

export const MedicineContext = createContext<TInfoContext>(defaultInfo)

const MedicineProvider = () => {
  const { notification } = App.useApp()

  const [typeMutate, setTypeMutate] = useState<
    "created" | "updated" | "deleted"
  >("created")
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<TFilter>({})
  const [info, setInfo] = useState<TInfoContext>({ ...defaultInfo, setPage })

  const { get, post, put, del } = useApi()
  const { data, isPending, refetch } = useQuery<TDataGetMedicine>({
    queryKey: ["getMedicines", page, filter],
    queryFn: () => {
      const params: any = {
        page: page - 1,
        size: 20,
      }
      if (!objectIsEmpty(filter))
        Object.keys(filter).forEach((key) => (params[key] = filter[key]))
      return get(GET_MEDICINES_PAGINATION, params)
    },
  })
  const { data: dataCategory, isPending: isPendingCategory } =
    useQuery<TDataGetMedicineCategory>({
      queryKey: ["getMedicineCategories"],
      queryFn: () => {
        return get(GET_MEDICINE_CATEGORIES_PAGINATION, { page: 0, size: 1000 })
      },
    })

  const { data: dataMutate, mutate } = useMutation({
    mutationFn: (values: any) => {
      if (values.id) return put(UPDATE_MEDICINE, values.id, values)
      if (typeof values === "string") return del(DELETE_MEDICINE, values)
      return post(CREATE_MEDICINE, values)
    },
  })

  const onSearch = (key: string, value: any) => {
    if (page !== 1 || !value) setPage(1)
    if (value) setFilter({ [key]: value })
    else setFilter({})
  }

  const onSubmit = (values: any, id?: string) => {
    setTypeMutate(id ? "updated" : "created")
    setInfo((prev) => ({ ...prev, loadingSubmit: true }))
    if (id) values.id = id
    mutate(values)
  }

  const onDelete = (id: string) => {
    setTypeMutate("deleted")
    setInfo((prev) => ({ ...prev, loading: true }))
    mutate(id)
  }

  useEffect(() => {
    setInfo((prev) => ({ ...prev, loadingSubmit: false }))
    if (dataMutate) {
      notification.success({
        message: "Success",
        description: `Data has been ${typeMutate} successfully`,
      })
      if (page === 1 && objectIsEmpty(filter)) refetch()
      else {
        setPage(1)
        setFilter({})
      }
    }
  }, [dataMutate])

  useEffect(() => {
    if (isPending || isPendingCategory)
      setInfo((prev) => ({ ...prev, loading: true }))
    else if (data && dataCategory) {
      const newData = data.content.map((item) => {
        const category = dataCategory.content.find(
          (el) => el.id === item.categoryId
        )
        if (item.updatedDate)
          item.updatedDate = convertISODate(item.updatedDate)
        return {
          ...item,
          category: category?.name || "",
          createdDate: convertISODate(item.createdDate),
        }
      })
      const newDataCategory = dataCategory.content.map((item) => ({
        label: item.name,
        value: item.id,
      }))
      setInfo((prev) => ({
        ...prev,
        data: newData,
        dataCategory: newDataCategory,
        total: data.totalElement,
        loading: false,
      }))
    }
  }, [data, dataCategory, isPending, isPendingCategory])

  return (
    <MedicineContext.Provider
      value={{ ...info, page, setPage, onDelete, onSubmit, onSearch }}
    >
      <Medicine />
    </MedicineContext.Provider>
  )
}

export default MedicineProvider
