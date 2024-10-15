import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Input, Popconfirm, message } from 'antd';
import BaseForm from '@/components/BaseForm';
import { Employee } from '@/types/EmployeeTypes';
import {Field} from "@/types/FieldTypes.ts";
import useApi from "@/hooks/useApi.tsx";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";

const { Search } = Input;

const employeeFields: Field[] = [
  { name: 'username', label: 'Username', type: 'text', rules: [{ required: true }] },
  { name: 'role', label: 'Role', type: 'select', rules: [{ required: true }], options: [{label: 'User', value: 'USER'}, {label: 'Admin', value: 'admin'}] },
  { name: 'password', label: 'Password', type: 'password', rules: [{ required: true }] },
  { name: 'firstName', label: 'First Name', type: 'text', rules: [{ required: true }] },
  { name: 'lastName', label: 'Last Name', type: 'text', rules: [{ required: true }] },
  { name: 'birthDate', label: 'Birth Date', type: 'date', rules: [{ required: true }] },
  { name: 'sex', label: 'Sex', type: 'select', rules: [{ required: true }], options: [{label: 'Male', value: 'M'}, {label: 'Female', value: 'F'}] },
  { name: 'type', label: 'Type', type: 'select', rules: [{ required: true }], options: [{label: 'Manager', value: 'Manager'}, {label: 'Employee', value: 'Employee'}]},
  { name: 'address', label: 'Address', type: 'textarea' },
  { name: 'mail', label: 'Email', type: 'email', rules: [{ required: true, type: 'email' }] },
  { name: 'phoneNo', label: 'Phone Number', type: 'text', rules:  [{ required: true }] },
  { name: 'salary', label: 'Salary', type: 'number', rules: [{ required: true }] },
];


const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [keyword, setKeyword] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const {post, put, get, del} = useApi();
  const fetchEmployees = async (_page: number = currentPage, _size: number = pageSize) => {
    try {
      const response = await get(`/employees`, {page: _page - 1, size: _size});
      const { data } = response;
      setEmployees(data.content);
      setTotal(data.totalElement);
    } catch (error) {
      console.log(error)
      message.error('Failed to fetch employees');
    }
  };

  const handleFinish = async (values: Employee) => {
    setSubmitting(true)
    try {
      if (editingEmployee) {
        await put(`/employees`,editingEmployee.id as string, values);
        message.success('Employee updated successfully');
      } else {
        await post('/employees', {
          ...values,
          role: 'USER',
        });
        message.success('Employee created successfully');
      }
      setIsModalVisible(false);
      setEditingEmployee(null);
      fetchEmployees(currentPage, pageSize);
    } catch (error) {
      message.error('Failed to save employee');
    }
    setSubmitting(false)
  };

  const handleDelete = async (id: any) => {
    try {
      await del(`/employees`, id);
      message.success('Employee deleted successfully');
      fetchEmployees(currentPage, pageSize);
    } catch (error) {
      message.error('Failed to delete employee');
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.username.toLowerCase().includes(keyword.toLowerCase())
  );

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'mail', key: 'mail' },
    { title: 'Salary', dataIndex: 'salary', key: 'salary' },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      className: 'text-end',
      render: (_: any, record: Employee) => (
        <>
          <Button type="link" className="p-2" onClick={() => setViewingEmployee(record)}><EyeOutlined/></Button>
          <Button type="link" className="p-2" onClick={() => { setEditingEmployee(record); setIsModalVisible(true); }}><EditOutlined/></Button>
          <Popconfirm
            title="Are you sure to delete this employee?"
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
    fetchEmployees();
  }, [])

  return (
    <div className="p-2">
      {/*<h1>Employee Management</h1>*/}

      <Search
        placeholder="Search employees" className="me-2"
        onSearch={(value) => setKeyword(value)}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />

      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Create New Employee
      </Button>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="username"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
            fetchEmployees(page, pageSize);
          },
        }}
      />

      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Create Employee'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <BaseForm isSubmitting={submitting}
          fields={employeeFields}
          onFinish={handleFinish}
          initialValues={editingEmployee || {}}
        />
      </Modal>

      <Modal
        title="Employee Details"
        visible={!!viewingEmployee}
        onCancel={() => setViewingEmployee(null)}
        footer={[
          <Button key="close" onClick={() => setViewingEmployee(null)}>Close</Button>,
        ]}
      >
        {viewingEmployee && (
          <div>
            <p><strong>Username:</strong> {viewingEmployee.username}</p>
            <p><strong>First Name:</strong> {viewingEmployee.firstName}</p>
            <p><strong>Last Name:</strong> {viewingEmployee.lastName}</p>
            <p><strong>Email:</strong> {viewingEmployee.mail}</p>
            <p><strong>Phone:</strong> {viewingEmployee.phoneNo}</p>
            <p><strong>Salary:</strong> {viewingEmployee.salary}</p>
            <p><strong>Address:</strong> {viewingEmployee.address}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Employees;
