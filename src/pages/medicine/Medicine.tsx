import ContentWrapper from "@/components/ContentWrapper"
import DrawerForm from "@/components/DrawerForm"
import Table from "@/components/Table"
import { App, Form, Input, Modal, Select } from "antd"
import { memo, useContext, useEffect, useState } from "react"
import { columns, fields } from "./Medicine.data"
import { TInfoMedicine } from "./Medicine.type"
import { MedicineContext } from "./MedicineContext"
import { useMutation } from "@tanstack/react-query"
import useApi from "@/hooks/useApi"
import { CREATE_MEDICINE_CATEGORY } from "@/api/medicineCategory.api"
import { SaveOutlined } from "@ant-design/icons"

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
    refetchCategory
  } = useContext(MedicineContext)
  const [open, setOpen] = useState(false)
  const [typeForm, setTypeForm] = useState<"add" | "edit">("add")
  const [initialValues, setInitialValues] = useState<TInfoMedicine>()
  const { notification } = App.useApp()
  const { post } = useApi()
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [categoryFormInstance] = Form.useForm()
  const { mutate, isPending: isMutationPending} = useMutation({
    mutationFn: (values: any) => {
      return post(CREATE_MEDICINE_CATEGORY, values)
    },
  })

  const handleOpen = (
    isOpen: boolean,
    typeForm: "add" | "edit",
    initialValues?: TInfoMedicine
  ) => {
    setOpen(isOpen)
    setTypeForm(typeForm)
    setInitialValues(initialValues)
  }

  const handleOpenCategoryModal = () => {
    setIsCategoryModalOpen(true)
  }

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false)
  }

  const handleSubmitCategory = (values: any) => {
    mutate(values, {
      onSuccess: (data) => {
        if (data) {
          notification.success({
            message: "Data has been created successfully"
          })
          handleCloseCategoryModal()
          refetchCategory()
        }
      }
    })
  }

  useEffect(() => {
    if (open) handleOpen(false, "add")
  }, [data])

  return (
    <ContentWrapper
      subjectCreate="medicine"
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
        fields={fields(dataCategory, dataUnit, handleOpenCategoryModal)}
        loading={loadingSubmit}
        initialValues={initialValues}
        setOpen={() => handleOpen(false, "add")}
        onSubmit={(values) => onSubmit(values, initialValues?.id)}
      />
      <Modal 
          title="Create Medicine Category" 
          open={isCategoryModalOpen}
          onCancel={handleCloseCategoryModal} 
          onOk={() => categoryFormInstance.submit()}
          okButtonProps={{
            loading: isMutationPending,
            type:"primary",
            icon: <SaveOutlined />
          }}
          okText="Save"
      >
        <Form 
          layout="vertical" 
          onFinish={handleSubmitCategory} 
          form={categoryFormInstance}
          clearOnDestroy
        >
          <Form.Item 
            label="Name" 
            key="name" 
            name="name" 
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input 
              type="text" 
              placeholder="Medicine Category Name"
            />
          </Form.Item>
          <Form.Item 
            label="Description" 
            key="description" 
            name="description" 
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea 
              placeholder="Medicine Category Description"
            />
          </Form.Item>
        </Form>
      </Modal>
    </ContentWrapper>
  )
}

export default memo(Medicine)
