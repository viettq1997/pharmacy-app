import { Form, Input } from 'antd';
import { TSupplierForm } from './Supplier.type';

const SupplierForm: TSupplierForm = ({ data, onChange, onFinish, formInstance }) => {
    return (
        <Form
            onValuesChange={changedValues => {
                onChange({
                    ...data,
                    ...changedValues
                });
            }}
            initialValues={data}
            layout="vertical"
            onFinish={onFinish}
            form={formInstance}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter name' }]}
            >
                <Input placeholder="Please enter name" />
            </Form.Item>
            <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
            >
                <Input style={{ width: '100%' }} placeholder="Please enter address" />
            </Form.Item>
            <Form.Item
                name="phoneNo"
                label="Phone number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
            >
                <Input placeholder="Please enter phone number" />
            </Form.Item>
            <Form.Item
                name="mail"
                label="Email"
                rules={[
                    {
                        type: 'email',
                        message: 'Invalid email'
                    }
                ]}
            >
                <Input style={{ width: '100%' }} placeholder="Please enter email" />
            </Form.Item>
        </Form>
    );
};

export default SupplierForm;
