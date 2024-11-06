import {Field} from "@/types/FieldTypes"
import {Button, Popconfirm, Space, TableProps} from "antd"
import Ability from "@/components/Ability";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {CustomerInterface} from "@/pages/customer/Customer.type.ts";

export const columns = (
    _onEdit: (record: any) => void,
    _onDelete: (id: string) => void
) =>
    [
        { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
        { title: 'Email', dataIndex: 'mail', key: 'mail' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Gender', dataIndex: 'sex', key: 'sex' },
        {
            key: "action",
            align: "center",
            width: 100,
            render: (record: CustomerInterface) => (
                <Space>
                    <Ability action="update" subject="customer">
                        <Button hidden
                                type="primary"
                                icon={<EditOutlined/>}
                                onClick={() => _onEdit(record)}
                        />
                    </Ability>
                    <Popconfirm
                        title="Confirm delete"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => _onDelete(record.id as string)}
                    >
                        <Ability action="delete" subject="customer">
                            <Button hidden danger type="primary" icon={<DeleteOutlined/>}/>
                        </Ability>
                    </Popconfirm>
                </Space>
            ),
        },
    ] satisfies TableProps["columns"]

export const fields: () => Field[] = () => [
    { name: 'phoneNo', label: 'Phone Number', type: 'text', rules:  [{ required: true }] },
    { name: 'firstName', label: 'First Name', type: 'text', rules: [{ required: false }] },
    { name: 'lastName', label: 'Last Name', type: 'text', rules: [{ required: false }] },
    { name: 'age', label: 'Age', type: 'number', rules: [{ required: true }] },
    // { name: 'birthDate', label: 'Birth Date', type: 'date', rules: [{ required: true }] },
    { name: 'sex', label: 'Gender', type: 'select', rules: [{ required: true }], options: [{label: 'Male', value: 'M'}, {label: 'Female', value: 'F'}] },
    { name: 'mail', label: 'Email', type: 'email', rules: [{ required: false, type: 'email' }] },
]
