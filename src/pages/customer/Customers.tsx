import React, { useEffect, useState } from 'react';
import {Table, Modal, Button, Input, Popconfirm, message, Card} from 'antd';
import BaseForm from '@/components/BaseForm';
import {Field} from "@/types/FieldTypes.ts";
import useApi from "@/hooks/useApi.tsx";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {CustomerType} from "@/types/CustomerTypes.ts";

const { Search } = Input;

const customerFields: Field[] = [
  { name: 'phoneNo', label: 'Phone Number', type: 'text', rules:  [{ required: true }] },
  { name: 'firstName', label: 'First Name', type: 'text', rules: [{ required: false }] },
  { name: 'lastName', label: 'Last Name', type: 'text', rules: [{ required: false }] },
  { name: 'age', label: 'Age', type: 'number', rules: [{ required: true }] },
  // { name: 'birthDate', label: 'Birth Date', type: 'date', rules: [{ required: true }] },
  { name: 'sex', label: 'Gender', type: 'select', rules: [{ required: true }], options: [{label: 'Male', value: 'M'}, {label: 'Female', value: 'F'}] },
  { name: 'mail', label: 'Email', type: 'email', rules: [{ required: false, type: 'email' }] },
];


const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerType | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [viewingCustomer, setViewingCustomer] = useState<CustomerType | null>(null);
  const [keyword, setKeyword] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const {post, put, get, del} = useApi();
  const fetchCustomers = async (_page: number = currentPage, _size: number = pageSize) => {
    try {
      const { content, totalElement } = await get(`/customers`, {page: _page - 1, size: _size});
      setCustomers(content);
      setTotal(totalElement);
    } catch (error) {
      console.log(error)
      // message.error('Failed to fetch customers');
    }
  };

  const handleFinish = async (values: CustomerType) => {
    setSubmitting(true)
    try {
      if (editingCustomer) {
        await put(`/customers`,editingCustomer.id as string, values);
        message.success('Customer updated successfully');
      } else {
        await post('/customers', {
          ...values,
          role: 'USER',
        });
        message.success('Customer created successfully');
      }
      setIsModalVisible(false);
      setEditingCustomer(null);
      fetchCustomers(currentPage, pageSize);
    } catch (error) {
      message.error('Failed to save customer');
    }
    setSubmitting(false)
  };

  const handleDelete = async (id: any) => {
    try {
      await del(`/customers`, id);
      message.success('Customer deleted successfully');
      fetchCustomers(currentPage, pageSize);
    } catch (error) {
      message.error('Failed to delete customer');
    }
  };

  const columns = [
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'mail', key: 'mail' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Gender', dataIndex: 'sex', key: 'sex' },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      className: 'text-end',
      render: (_: any, record: CustomerType) => (
        <>
          <Button type="link" className="p-2" onClick={() => setViewingCustomer(record)}><EyeOutlined/></Button>
          <Button type="link" className="p-2" onClick={() => { setEditingCustomer(record); setIsModalVisible(true); }}><EditOutlined/></Button>
          <Popconfirm
            title="Are you sure to delete this customer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" className="p-2" danger><DeleteOutlined/></Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchCustomers();
  }, [keyword])

  return (
    <Card>
      <div className=" ">
        {/*<h1>Customer Management</h1>*/}

        <Search
          placeholder="Search customers" className="me-2"
          onSearch={(value) => setKeyword(value)}
          onChange={(e) => setKeyword(e.target.value)}
          style={{width: 300, marginBottom: 16}}
        />

        <Button type="primary" onClick={() => setIsModalVisible(true)} style={{marginBottom: 16}}>
          Create New Customer
        </Button>

        <Table
          columns={columns}
          dataSource={customers}
          rowKey="username"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
              fetchCustomers(page, pageSize);
            },
          }}
        />

        <Modal
          title={editingCustomer ? 'Edit Customer' : 'Create Customer'}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <BaseForm isSubmitting={submitting}
                    fields={customerFields}
                    onFinish={handleFinish}
                    initialValues={editingCustomer || {}}
          />
        </Modal>

        <Modal
          title="Customer Details"
          visible={!!viewingCustomer}
          onCancel={() => setViewingCustomer(null)}
          footer={[
            <Button key="close" onClick={() => setViewingCustomer(null)}>Close</Button>,
          ]}
        >
          {viewingCustomer && (
            <div>
              <p><strong>First Name:</strong> {viewingCustomer.firstName}</p>
              <p><strong>Last Name:</strong> {viewingCustomer.lastName}</p>
              <p><strong>Age:</strong> {viewingCustomer.age}</p>
              <p><strong>Gender:</strong> {viewingCustomer.sex}</p>
              <p><strong>Email:</strong> {viewingCustomer.mail}</p>
              <p><strong>Phone:</strong> {viewingCustomer.phoneNo}</p>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  );
};

export default Customers;
