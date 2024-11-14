import ContentWrapper from "@/components/ContentWrapper"
import DrawerForm from "@/components/DrawerForm"
import Table from "@/components/Table"
import { Select } from "antd"
import { memo, useContext, useEffect, useState } from "react"
import { columns, fields } from "./Medicine.data"
import { TInfoMedicine } from "./Medicine.type"
import { MedicineContext } from "./MedicineContext"

const Medicine = () => {
  const {
    data,
    dataCategory,
    dataUnit,
    loading,
    loadingSubmit,
    total,
    page,
    setPage,
    onDelete,
    onSubmit,
    onSearch,
  } = useContext(MedicineContext)

  const [open, setOpen] = useState(false)
  const [typeForm, setTypeForm] = useState<"add" | "edit">("add")
  const [initialValues, setInitialValues] = useState<TInfoMedicine>()

  const handleOpen = (
    isOpen: boolean,
    typeForm: "add" | "edit",
    initialValues?: TInfoMedicine
  ) => {
    setOpen(isOpen)
    setTypeForm(typeForm)
    setInitialValues(initialValues)
  }

  useEffect(() => {
    if (open) handleOpen(false, "add")
  }, [data])

  return (
    <ContentWrapper
      filterElement={
        <>
          <Select
            allowClear
            showSearch
            size="large"
            placeholder="Category"
            options={dataCategory}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => onSearch("categoryId", value)}
            className="w-[200px]"
          />
        </>
      }
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
        width={500}
        title={typeForm === "add" ? "Create Medicine" : "Edit Medicine"}
        open={open}
        fields={fields(dataCategory, dataUnit)}
        loading={loadingSubmit}
        initialValues={initialValues}
        setOpen={() => handleOpen(false, "add")}
        onSubmit={(values) => onSubmit(values, initialValues?.id)}
      />
    </ContentWrapper>
  )
}

export default memo(Medicine)
