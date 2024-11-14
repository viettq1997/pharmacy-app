import {
  CREATE_MEDICINE,
  DELETE_MEDICINE,
  GET_MEDICINE_UNITS,
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
import {
  TDataGetMedicine,
  TDataGetMedicineUnit,
  TInfoContext,
} from "./Medicine.type"

const defaultInfo: TInfoContext = {
  data: [],
  dataCategory: [],
  dataUnit: [],
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
  const { data: dataUnit, isPending: isPendingUnit } = useQuery<
    TDataGetMedicineUnit[]
  >({
    queryKey: ["getMedicineUnit"],
    queryFn: () => {
      return get(GET_MEDICINE_UNITS)
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
    if (isPending || isPendingCategory || isPendingUnit)
      setInfo((prev) => ({ ...prev, loading: true }))
    else if (data && dataCategory && dataUnit) {
      const newData = data.content.map((item) => {
        if (item.updatedDate)
          item.updatedDate = convertISODate(item.updatedDate)
        return {
          ...item,
          unit: item.unit,
          medicineUnitId: item.unit.id,
          category: item.category,
          categoryId: item.category.id,
          createdDate: convertISODate(item.createdDate),
        }
      })
      const newDataCategory = dataCategory.content.map((item) => ({
        label: item.name,
        value: item.id,
      }))
      const newDataUnit = dataUnit.map((item) => ({
        label: item.unit,
        value: item.id,
      }))
      setInfo((prev) => ({
        ...prev,
        data: newData,
        dataCategory: newDataCategory,
        dataUnit: newDataUnit,
        total: data.totalElement,
        loading: false,
      }))
    }
  }, [
    data,
    dataCategory,
    dataUnit,
    isPending,
    isPendingCategory,
    isPendingUnit,
  ])

  return (
    <MedicineContext.Provider
      value={{ ...info, page, setPage, onDelete, onSubmit, onSearch }}
    >
      <Medicine />
    </MedicineContext.Provider>
  )
}

export default MedicineProvider
