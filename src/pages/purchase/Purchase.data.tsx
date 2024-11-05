import { Field } from "@/types/FieldTypes"
import { TableProps } from "antd"
import {maxDateByField, maxDateByValue, minDateByField, minDateByValue} from "@/utils/validators.ts";

export const columns = (
  _onEdit: (record: any) => void,
  _onDelete: (id: string) => void
) =>
  [
    {
      key: "medicine",
      title: "Medicine",
      dataIndex: "medicine",
      render: (record) => {
        return record?.name
      }
    },
    {
      key: "supplier",
      title: "Supplier",
      dataIndex: "supplier",
      render: (record) => {
        return record?.name
      }
    },
    {
      key: "quantity",
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      key: "createdDate",
      title: "Created Date",
      dataIndex: "createdDate",
      width: 150,
    },
    {
      key: "updatedDate",
      title: "Updated Date",
      dataIndex: "updatedDate",
      width: 150,
    },
    // {
    //   key: "action",
    //   align: "center",
    //   width: 100,
    //   render: (record: PurchaseInterface) => (
    //     <Space>
    //       <Ability action="update" subject="stockPurchase">
    //         <Button hidden
    //           type="primary"
    //           icon={<EditOutlined />}
    //           onClick={() => onEdit(record)}
    //         />
    //       </Ability>
    //       <Popconfirm
    //         title="Confirm delete"
    //         okText="Yes"
    //         cancelText="No"
    //         onConfirm={() => onDelete(record.id as string)}
    //       >
    //         <Ability action="delete" subject="stockPurchase">
    //           <Button hidden danger type="primary" icon={<DeleteOutlined />} />
    //         </Ability>
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ] satisfies TableProps["columns"]

export const fields: (
  fetchMedicine: (search: string) => Promise<any[]>,
  fetchSupplier: (search: string) => Promise<any[]>,
  fetchLocationRack: (search: string) => Promise<any[]>
) => Field[] = (fetchMedicine, fetchSupplier, fetchLocationRack) => [
  {
    label: "medicine",
    name: "medicineId",
    type: "select-api",
    placeholder: "Medicine",
    fetchOptions: fetchMedicine,
    rules: [{ required: true, message: "Medicine is required" }],
  },
  {
    label: "Supplier",
    name: "supplierId",
    type: "select-api",
    placeholder: "Supplier",
    fetchOptions: fetchSupplier,
    rules: [{ required: true, message: "Supplier is required" }],
  },
  {
    label: "Location Rack",
    name: "locationRackId",
    type: "select-api",
    placeholder: "Location Rack",
    fetchOptions: fetchLocationRack,
    rules: [{ required: true, message: "Location rack is required" }],
  },
  {
    label: "Quantity",
    name: "quantity",
    type: "number",
    placeholder: "Quantity",
    rules: [{ required: true, message: "Quantity is required" }, {min: 1, message: "Quantity must be at least 1" }],
  },
  {
    label: "Cost",
    name: "cost",
    type: "number",
    placeholder: "Cost",
    rules: [{ required: true, message: "Cost is required" }, {min: 0, message: "Cost must be at least 0" }],
  },
  {
    label: "MFG date",
    name: "mfgDate",
    type: "date",
    placeholder: "MFG date",
    rules: [{ required: true, message: "MFG date is required" }, maxDateByValue('mfgDate', 'EXP date', new Date(), 'MFG date must be less than today!'), maxDateByField('mfgDate', 'MFG date', 'expDate')],
  },
  {
    label: "EXP date",
    name: "expDate",
    type: "date",
    placeholder: "EXP date",
    rules: [{ required: true, message: "EXP date is required" }, minDateByValue('expDate', 'EXP date', new Date(), 'EXP date must be greater than today!'), minDateByField('expDate', 'EXP date', 'mfgDate')],
  },
]
