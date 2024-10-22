import { Field } from "@/types/FieldTypes"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Space, TableProps } from "antd"
import { TInfoMedicine } from "./Medicine.type"

export const columns = (
  onEdit: (record: any) => void,
  onDelete: (id: string) => void
) =>
  [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "price",
      title: "Price",
      dataIndex: "price",
      render: (price: number) => (price ? `$${price}` : ""),
    },
    {
      key: "category",
      title: "Category",
      dataIndex: "category",
    },
    {
      key: "createdDate",
      title: "Created Date",
      dataIndex: "createdDate",
      width: 150,
    },
    {
      key: "createdBy",
      title: "Created By",
      dataIndex: "createdBy",
      width: 120,
    },
    {
      key: "updatedDate",
      title: "Updated Date",
      dataIndex: "updatedDate",
      width: 150,
    },
    {
      key: "updatedBy",
      title: "Updated By",
      dataIndex: "updatedBy",
      width: 120,
    },
    {
      key: "action",
      align: "center",
      width: 100,
      render: (record: TInfoMedicine) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Confirm delete"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ] satisfies TableProps["columns"]

export const fields: (optionsCategory: any[]) => Field[] = (
  optionsCategory
) => [
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Medicine Name",
    rules: [{ required: true, message: "Name is required" }],
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    placeholder: "Medicine Price",
    prefix: "$",
    rules: [{ required: true, message: "Price is required" }],
  },
  {
    label: "Category",
    name: "categoryId",
    type: "select",
    placeholder: "Medicine Category",
    rules: [{ required: true, message: "Category is required" }],
    options: optionsCategory,
  },
]
