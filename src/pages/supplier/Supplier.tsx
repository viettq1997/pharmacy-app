import useApi from '@/hooks/useApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { App, Button, Drawer, Flex, Form, Input, Popconfirm, Space, Table, TableProps } from 'antd';
import { memo, useEffect, useState } from 'react';
import {
    MutationActions,
    TGetSupplierData,
    TGetSupplierResponse,
    TMutationSupplierResponse,
    TSupplierInfo
} from './Supplier.type';
import SupplierForm from './SupplierForm';

const defaultFormData = {
    id: null,
    name: '',
    address: '',
    phoneNo: '',
    mail: ''
};

const defaultFilters = {
    name: '',
    page: 0,
    size: 20
};

const getMutationMessage = (isSuccessful: unknown) => {
    return {
        [MutationActions.CREATE]: `Created ${isSuccessful ? 'successfully' : 'unsuccessfully'}`,
        [MutationActions.EDIT]: `Updated ${isSuccessful ? 'successfully' : 'unsuccessfully'}`,
        [MutationActions.DELETE]: `Deleted ${isSuccessful ? 'successfully' : 'unsuccessfully'}`
    };
};

const Supplier = () => {
    const { get, post, put, del } = useApi();
    const [filters, setFilters] = useState(defaultFilters);
    const [formInstance] = Form.useForm();
    const [getSupplierData, setGetSupplierData] = useState<TGetSupplierData>();
    const { notification } = App.useApp();
    const {
        data: getSupplierResponse,
        status: getStatus,
        refetch
    } = useQuery<TGetSupplierResponse>({
        queryKey: ['getSuppliers', filters],
        queryFn: () => get('/suppliers', filters)
    });
    const { mutate } = useMutation({
        mutationFn: ({ action, params }: { action: MutationActions; params: any }) => {
            if (action == MutationActions.CREATE) return post('/suppliers', params);
            if (action == MutationActions.EDIT) return put('/suppliers', params.id, params);
            if (action == MutationActions.DELETE) return del('/suppliers', params.id);

            return new Promise(() => {});
        }
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState<TSupplierInfo>(defaultFormData);

    useEffect(() => {
        if (getSupplierResponse && getSupplierResponse.data && getStatus == 'success') {
            setGetSupplierData(getSupplierResponse.data);
        }
    }, [getSupplierResponse]);

    useEffect(() => {
        formInstance.setFieldsValue(formData);
    }, [formData, formInstance]);

    const columns: TableProps<TSupplierInfo>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Phone number',
            dataIndex: 'phoneNo',
            key: 'phoneNo'
        },
        {
            title: 'Email',
            dataIndex: 'mail',
            key: 'mail'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, supplier) => (
                <Space size="middle">
                    <a
                        onClick={() => {
                            selectEditedSupplier(supplier);
                        }}
                    >
                        Edit
                    </a>
                    <Popconfirm
                        onConfirm={() => removeSupplier(supplier.id)}
                        title="Confirm to delete the supplier"
                        description="Are you sure to delete this supplier?"
                    >
                        <a>Delete</a>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(defaultFormData);
    };

    const selectEditedSupplier = (supplier: TSupplierInfo) => {
        setFormData(supplier);
        openForm();
    };

    const mutateSupplier = (action: MutationActions, params: any) => {
        mutate(
            { action, params },
            {
                onSuccess: data => {
                    const message = getMutationMessage(data)[action];

                    if (data) {
                        if ([MutationActions.DELETE, MutationActions.CREATE].includes(action)) {
                            refetch();
                        }

                        if (action == MutationActions.EDIT && getSupplierData) {
                            const { content } = getSupplierData;

                            setGetSupplierData({
                                ...getSupplierData,
                                content: content.map(supplier =>
                                    supplier.id == formData.id ? formData : supplier
                                )
                            });
                        }

                        closeForm();
                    }

                    notification[data ? 'success' : 'error']({
                        message
                    });
                },
                onError: () => {}
            }
        );
    };

    const createSupplier = () => {
        mutateSupplier(MutationActions.CREATE, formData);
    };

    const editSupplier = () => {
        mutateSupplier(MutationActions.EDIT, formData);
    };

    const removeSupplier = (id: number | null) => {
        mutateSupplier(MutationActions.DELETE, { id });
    };

    const finish = () => {
        if (formData.id) editSupplier();
        else createSupplier();
    };

    const search = (keyword: string) => {
        setFilters({ ...defaultFilters, name: keyword });
    };

    let suppliers: TSupplierInfo[] = [],
        totalElement = 0;

    if (getSupplierData) {
        suppliers = getSupplierData.content;
        totalElement = getSupplierData.totalElement;
    }

    return (
        <Flex gap="middle" vertical>
            <Flex justify="space-between" gap={16}>
                <Input.Search
                    placeholder="Search supplier..."
                    allowClear
                    onSearch={search}
                    style={{ width: 320 }}
                    onClear={() => {
                        setFilters(defaultFilters);
                    }}
                />
                <Button className="w-fit" type="primary" onClick={openForm}>
                    New supplier
                </Button>
            </Flex>
            <Table<TSupplierInfo>
                columns={columns}
                dataSource={suppliers}
                loading={getStatus == 'pending'}
                pagination={{
                    current: filters.page + 1,
                    pageSize: filters.size,
                    total: totalElement,
                    onChange: page => {
                        setFilters({
                            ...filters,
                            page: page - 1
                        });
                    }
                }}
            />
            <Drawer
                title={formData.id ? 'Edit a supplier' : 'Create a new supplier'}
                size="large"
                onClose={closeForm}
                open={isFormOpen}
                extra={
                    <Space>
                        <Button onClick={closeForm}>Cancel</Button>
                        <Button onClick={() => formInstance.submit()} type="primary">
                            Submit
                        </Button>
                    </Space>
                }
            >
                <SupplierForm
                    data={formData}
                    onFinish={finish}
                    onChange={setFormData}
                    formInstance={formInstance}
                />
            </Drawer>
        </Flex>
    );
};

export default memo(Supplier);
