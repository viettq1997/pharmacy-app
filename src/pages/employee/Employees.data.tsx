import Ability from "@/components/Ability"
import { EmployeeInterface } from "@/pages/employee/Employees.type.ts"
import { Field } from "@/types/FieldTypes"
import { maxDateByValue, minByValue } from "@/utils/validators.ts"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Space, TableProps } from "antd"

export const columns = (
  _onEdit: (record: any) => void,
  _onDelete: (id: string) => void
) =>
  [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Email", dataIndex: "mail", key: "mail" },
    { title: "Salary", dataIndex: "salary", key: "salary" },
    {
      key: "action",
      align: "center",
      width: 100,
      render: (record: EmployeeInterface) => (
        <Space>
          <Ability action="update" subject="employee">
            <Button
              hidden
              type="primary"
              icon={<EditOutlined />}
              onClick={() => _onEdit(record)}
            />
          </Ability>
          <Ability action="delete" subject="employee">
            <Popconfirm
              title="Confirm delete"
              okText="Yes"
              cancelText="No"
              onConfirm={() => _onDelete(record.id as string)}
            >
              <Button hidden danger type="primary" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Ability>
        </Space>
      ),
    },
  ] satisfies TableProps["columns"]

export const fields: () => Field[] = () => [
  {
    name: "username",
    label: "Username",
    type: "text",
    rules: [{ required: true, min: 6 }],
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    rules: [{ required: true }],
    options: [
      { label: "User", value: "USER" },
      { label: "Admin", value: "admin" },
    ],
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    rules: [{ required: true, min: 8 }],
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    rules: [{ required: true }],
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    rules: [{ required: true }],
  },
  {
    name: "birthDate",
    label: "Birth Date",
    type: "date",
    rules: [
      { required: true },
      maxDateByValue(
        "birthDate",
        "EXP date",
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        "Birth date must be less than today!"
      ),
    ],
  },
  {
    name: "sex",
    label: "Sex",
    type: "select",
    rules: [{ required: true }],
    options: [
      { label: "Male", value: "M" },
      { label: "Female", value: "F" },
    ],
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    rules: [{ required: true }],
    options: [
      { label: "Manager", value: "Manager" },
      { label: "Employee", value: "Employee" },
    ],
  },
  { name: "address", label: "Address", type: "textarea" },
  {
    name: "mail",
    label: "Email",
    type: "email",
    rules: [{ required: true, type: "email" }],
  },
  {
    name: "phoneNo",
    label: "Phone Number",
    type: "text",
    rules: [
      { required: true, min: 9 },
      {
        pattern: /[0-9-+ ]/,
        message: "Phone number only includes numbers, space, + and -",
      },
    ],
  },
  {
    name: "salary",
    label: "Salary",
    type: "number",
    rules: [{ required: true }, minByValue("salary", "Salary", 0)],
  },
]
