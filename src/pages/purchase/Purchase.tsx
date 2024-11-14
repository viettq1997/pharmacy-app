import ContentWrapper from "@/components/ContentWrapper"
import DrawerForm from "@/components/DrawerForm"
import Table from "@/components/Table"
import {useContext, useEffect, useState} from "react"
import {PurchaseContext} from "./PurchaseContext.tsx"
import {PurchaseInterface} from "@/pages/purchase/Purchase.type.ts";
import {columns, fields} from "@/pages/purchase/Purchase.data.tsx";
import useApi from "@/hooks/useApi.tsx";
import {GET_MEDICINES_PAGINATION} from "@/api/medicine.api.ts";
import {GET_SUPPLIER} from "@/api/supplier.api.ts";
import {GET_LOCATION_RACK} from "@/api/locationRack.api.ts";

const Purchase = () => {
  const {
    data,
    loading,
    loadingSubmit,
    total,
    page,
    setPage,
    onDelete,
    onSubmit,
    onSearch,
  } = useContext(PurchaseContext)

  const [open, setOpen] = useState(false)
  const [typeForm, setTypeForm] = useState<"add" | "edit">("add")
  const [initialValues, setInitialValues] = useState<PurchaseInterface>()
  const {get} = useApi()

  async function getMedList(keyword: string): Promise<any[]> {
    const params: any = {
      page: 0,
      size: 50,
      keyword: keyword || undefined,
    }
    const {content: listMeds} = await get(GET_MEDICINES_PAGINATION, params)
    return listMeds.map((x: any) => ({
      ...x,
      label: x.name,
      value: x.id,
    }))
  }
  async function getSuplierList(keyword: string): Promise<any[]> {
    const params: any = {
      page: 0,
      size: 50,
      keyword: keyword || undefined,
    }
    const {content: listMeds} = await get(GET_SUPPLIER, params)
    return listMeds.map((x: any) => ({
      ...x,
      label: x.name,
      value: x.id,
    }))
  }
  async function getLocationRack(keyword: string): Promise<any[]> {
    const params: any = {
      page: 0,
      size: 50,
      keyword: keyword || undefined,
    }
    const {content: listMeds} = await get(GET_LOCATION_RACK, params)
    return listMeds.map((x: any) => ({
      ...x,
      label: x.position,
      value: x.id,
    }))
  }

  const handleOpen = (
    isOpen: boolean,
    typeForm: "add" | "edit",
    initialValues?: PurchaseInterface
  ) => {
    setOpen(isOpen)
    setTypeForm(typeForm)
    setInitialValues(initialValues ? {
      ...initialValues,
      medicineId: initialValues?.medicine?.id || '',
      supplierId: initialValues?.supplier?.id || '',
      locationRack: initialValues?.locationRack?.id || ''
    } : initialValues)
  }

  useEffect(() => {
    if (open) handleOpen(false, "add")
  }, [data])

  return (
    <ContentWrapper
      subjectCreate="stockPurchase"
      onAdd={() => handleOpen(true, "add")}
      onSearch={(keyword) => onSearch("name", keyword)}
    >
      <Table
        page={page}
        total={total}
        loading={loading}
        dataSource={data}
        columns={columns(
          (initialValues) => handleOpen(true, "edit", initialValues),
          onDelete
        )}
        setPage={setPage}
      />
      <DrawerForm
        title={
          typeForm === "add"
            ? "Create purchase"
            : "Edit purchase"
        }
        open={open}
        fields={fields(getMedList, getSuplierList, getLocationRack)}
        loading={loadingSubmit}
        initialValues={initialValues}
        setOpen={() => handleOpen(false, "add")}
        onSubmit={(values) => onSubmit(values, initialValues?.id)}
      />
    </ContentWrapper>
  )
}

export default Purchase
