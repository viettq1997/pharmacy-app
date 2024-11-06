import ContentWrapper from "@/components/ContentWrapper"
import DrawerForm from "@/components/DrawerForm"
import Table from "@/components/Table"
import {useContext, useEffect, useState} from "react"
import {EmployeesContext} from "@/pages/employee/EmployeesContext.tsx";
import {EmployeeInterface} from "@/pages/employee/Employees.type.ts";
import {columns, fields} from "@/pages/employee/Employees.data.tsx";

const Employee = () => {
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
  } = useContext(EmployeesContext)

  const [open, setOpen] = useState(false)
  const [typeForm, setTypeForm] = useState<"add" | "edit">("add")
  const [initialValues, setInitialValues] = useState<EmployeeInterface>()

  const handleOpen = (
      isOpen: boolean,
      typeForm: "add" | "edit",
      initialValues?: EmployeeInterface
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
                  ? "Create Employee"
                  : "Edit Employee"
            }
            open={open}
            fields={fields()}
            loading={loadingSubmit}
            initialValues={initialValues}
            setOpen={() => handleOpen(false, "add")}
            onSubmit={(values) => onSubmit(values, initialValues?.id)}
        />
      </ContentWrapper>
  )
}

export default Employee
