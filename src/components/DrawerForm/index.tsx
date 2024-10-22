import { SaveOutlined } from "@ant-design/icons"
import { Button, Drawer, Form } from "antd"
import { FC, memo, useEffect } from "react"
import CustomForm, { TCustomFormProps } from "./Form"

type TDrawerFormProps = {
  open: boolean
  title: string
  width?: number
  loading?: boolean
  setOpen: () => void
} & Omit<TCustomFormProps, "form">

const DrawerForm: FC<TDrawerFormProps> = ({
  open,
  title,
  loading,
  width = 600,
  setOpen,
  ...props
}) => {
  const [form] = Form.useForm()

  const onSubmit = () => {
    form.submit()
  }

  useEffect(() => {
    if (open) form.resetFields()
  }, [open])

  return (
    <Drawer
      destroyOnClose
      open={open}
      title={title}
      width={width}
      keyboard={false}
      maskClosable={false}
      onClose={setOpen}
      extra={
        <Button
          type="primary"
          loading={loading}
          icon={<SaveOutlined />}
          onClick={onSubmit}
        >
          Save
        </Button>
      }
    >
      <CustomForm form={form} {...props} />
    </Drawer>
  )
}

export default memo(DrawerForm)
