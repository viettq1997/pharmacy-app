import React, {useState} from 'react';
import {Table, Input, Button, Space, Modal, Form, Select, message} from 'antd';
import {PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import {useKeycloak} from "@react-keycloak/web";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import useApi from "@/hooks/useApi.tsx";

const {Search} = Input;
const {Option} = Select;

interface Employee {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  roles: string[];
}

const EmployeeManagement: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  const {keycloak} = useKeycloak();
  const {apiPost, apiPut, apiGet, apiDelete} = useApi();
  const queryClient = useQueryClient();
  // Fetch employees
  const {data: employees, isLoading} = useQuery<Employee[]>({
  // const getList = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!keycloak.authenticated || !keycloak.didInitialize) {
        throw new Error('Not authenticated');
      }
      return await apiGet(`${keycloak.authServerUrl}/admin/realms/${keycloak.realm}/users`);;
    },
  });

  // Add employee mutation
  const addEmployeeMutation = useMutation({
    mutationFn: (newEmployee: Omit<Employee, 'id'>) =>
      apiPost(`${keycloak.authServerUrl}/admin/realms/${keycloak.realm}/users`, newEmployee),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['employees']});
      message.success('Employee added successfully');
      setModalVisible(false);
    },
  })

  // Update employee mutation
  const updateEmployeeMutation = useMutation(
    {
      mutationFn: (updatedEmployee: Employee) =>
        apiPut(`${keycloak.authServerUrl}/admin/realms/${keycloak.realm}/users/${updatedEmployee.id}`, updatedEmployee),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['employees']});
        message.success('Employee updated successfully');
        setModalVisible(false);
      },
    }
  );

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation(
    {
      mutationFn:(employeeId: string) =>
        apiDelete(`${keycloak.authServerUrl}/admin/realms/${keycloak.realm}/users/${employeeId}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        message.success('Employee deleted successfully');
      },
    }
  );

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (enabled ? 'Enabled' : 'Disabled'),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => {
        console.log(roles)
        return 'Roles'
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button icon={<EyeOutlined/>} onClick={() => handleViewDetails(record)}/>
          <Button icon={<EditOutlined/>} onClick={() => handleEdit(record)}/>
          <Button icon={<DeleteOutlined/>} onClick={() => handleDelete(record)} danger/>
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleStatusChange = (value: 'all' | 'enabled' | 'disabled') => {
    setStatusFilter(value);
  };

  const handleAddEmployee = () => {
    setModalType('add');
    setSelectedEmployee(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleViewDetails = (employee: Employee) => {
    setModalType('view');
    setSelectedEmployee(employee);
    form.setFieldsValue(employee);
    setModalVisible(true);
  };

  const handleEdit = (employee: Employee) => {
    setModalType('edit');
    setSelectedEmployee(employee);
    form.setFieldsValue(employee);
    setModalVisible(true);
  };

  const handleDelete = (employee: Employee) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
      content: `This will permanently delete ${employee.firstName} ${employee.lastName}.`,
      onOk() {
        deleteEmployeeMutation.mutate(employee.id);
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (modalType === 'add') {
        addEmployeeMutation.mutate(values);
      } else if (modalType === 'edit' && selectedEmployee) {
        updateEmployeeMutation.mutate({...selectedEmployee, ...values});
      }
    });
  };

  const filteredEmployees = employees?.filter((employee) => {
    const matchesKeyword =
      employee?.username?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      employee?.firstName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      employee?.lastName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      employee?.email?.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || (statusFilter === 'enabled' && employee.enabled) || (statusFilter === 'disabled' && !employee.enabled);

    return matchesKeyword && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Search
            placeholder="Search employees"
            onSearch={handleSearch}
            style={{width: 300}}
            allowClear
          />
          <Select defaultValue="all" style={{width: 120}} onChange={handleStatusChange}>
            <Option value="all">All Status</Option>
            <Option value="enabled">Enabled</Option>
            <Option value="disabled">Disabled</Option>
          </Select>
        </div>
        <Button type="primary" icon={<PlusOutlined/>} onClick={handleAddEmployee}>
          Add Employee
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredEmployees} loading={isLoading} rowKey="id"/>

      <Modal
        title={modalType === 'add' ? 'Add Employee' : modalType === 'edit' ? 'Edit Employee' : 'Employee Details'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okButtonProps={{disabled: modalType === 'view'}}
        okText={modalType === 'add' ? 'Add' : 'Save'}
      >
        <Form form={form} layout="vertical" disabled={modalType === 'view'}>
          <Form.Item name="username" label="Username" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name="firstName" label="First Name" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{required: true, type: 'email'}]}>
            <Input/>
          </Form.Item>
          <Form.Item name="enabled" label="Status" rules={[{required: true}]}>
            <Select>
              <Option value={true}>Enabled</Option>
              <Option value={false}>Disabled</Option>
            </Select>
          </Form.Item>
          <Form.Item name="roles" label="Roles" rules={[{required: true}]}>
            <Select mode="multiple">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
