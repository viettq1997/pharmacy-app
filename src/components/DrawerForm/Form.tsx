import { Field } from "@/types/FieldTypes"
import { Form, FormInstance, Input, InputNumber, Select } from "antd"
import { FC, memo } from "react"
import {SearchApi} from "@/components/DrawerForm/SelectApi.tsx";

export type TCustomFormProps = {
  form: FormInstance
  fields: Field[]
  initialValues?: any
  onSubmit: (values: any) => void
}

const CustomForm: FC<TCustomFormProps> = ({
  form,
  fields,
  initialValues,
  onSubmit,
}) => {
  const renderField = (field: Field) => {
    switch (field.type) {
      case "number":
        return (
          <InputNumber
            prefix={field.prefix}
            suffix={field.suffix}
            placeholder={field.placeholder}
            className="w-full"
          />
        )
      case "textarea":
        return (
          <Input.TextArea
            placeholder={field.placeholder}
            autoSize={{ minRows: 3 }}
          />
        )
      case "select":
        return (
          <Select placeholder={field.placeholder} options={field.options} />
        )
      case "select-api":
        return (
          <SearchApi {...field} placeholder={field.placeholder}
                      onChange={(newValue) => {
                        form.setFieldValue(field.name, newValue.value);
                      }}
                     showSearch={true}
                     value={form.getFieldValue(field.name)}
                     fetchOptions={field.fetchOptions}/>
        )
      default:
        return (
          <Input
            prefix={field.prefix}
            suffix={field.suffix}
            placeholder={field.placeholder}
            type={field.type}
          />
        )
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          label={field.label}
          name={field.name}
          rules={field.rules}
        >
          {renderField(field)}
        </Form.Item>
      ))}
    </Form>
  )
}

export default memo(CustomForm)
