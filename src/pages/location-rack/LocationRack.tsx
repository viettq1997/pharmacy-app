import useApi from '@/hooks/useApi';
import { convertISODate } from '@/utils/function';
import { useMutation, useQuery } from '@tanstack/react-query';
import { App, Button, Drawer, Flex, Form, Input, Popconfirm, Space, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import {
    MutationActions,
    TGetLocationRackData,
    TGetLocationRackResponse,
    TLocationRackInfo
} from './LocationRack.type';

const defaultFilters: any = {
    position: '',
    page: 0,
    size: 20
};

const defaultFormData: any = {
    id: null,
    position: '',
    createdDate: ''
};

const getMutationMessage = (isSuccessful: unknown) => {
    return {
        [MutationActions.CREATE]: `Created ${isSuccessful ? 'successfully' : 'unsuccessfully'}`,
        [MutationActions.EDIT]: `Updated ${isSuccessful ? 'successfully' : 'unsuccessfully'}`,
        [MutationActions.DELETE]: `Deleted ${isSuccessful ? 'successfully' : 'unsuccessfully'}`
    };
};

const LocationRack = () => {
    const { get, post, put, del } = useApi();
    const [getLocationRackData, setGetLocationRackData] = useState<TGetLocationRackData>();
    const [filters, setFilters] = useState(defaultFilters);
    const {
        data: getLocationRackResponse,
        status: getStatus,
        refetch
    } = useQuery<TGetLocationRackResponse>({
        queryKey: ['getLocationRacks', filters],
        queryFn: () => get('/locationRacks', filters)
    });
    const { mutate } = useMutation({
        mutationFn: ({ action, params }: { action: MutationActions; params: any }) => {
            if (action == MutationActions.CREATE) return post('/locationRacks', params);
            if (action == MutationActions.EDIT) return put('/locationRacks', params.id, params);
            if (action == MutationActions.DELETE) return del('/locationRacks', params.id);

            return new Promise(() => {});
        }
    });
    const columns: TableProps<TLocationRackInfo>['columns'] = [
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position'
        },

        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate'
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, locationRack) => (
                <Space size="middle">
                    <a
                        onClick={() => {
                            selectEditedLocationRack(locationRack);
                        }}
                    >
                        Edit
                    </a>
                    <Popconfirm
                        onConfirm={() => {
                            removeLocationRack(locationRack.id);
                        }}
                        title="Confirm to delete the location"
                        description="Are you sure to delete this location?"
                    >
                        <a>Delete</a>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const [formData, setFormData] = useState<TLocationRackInfo>(defaultFormData);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formInstance] = Form.useForm();
    const { notification } = App.useApp();
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        if (getLocationRackResponse && getLocationRackResponse.data && getStatus == 'success')
            setGetLocationRackData(getLocationRackResponse.data);
    }, [getLocationRackResponse]);

    useEffect(() => {
        formInstance.setFieldsValue(formData);
    }, [formData, formInstance]);

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormData(defaultFormData);
    };

    const onSearch = (value: string) => {
        setFilters({
            ...defaultFilters,
            position: value
        });
    };

    const selectEditedLocationRack = (locationRack: TLocationRackInfo) => {
        setFormData(locationRack);
        openForm();
    };

    const mutateLocationRack = (action: MutationActions, params: any) => {
        mutate(
            { action, params },
            {
                onSuccess: data => {
                    const message = getMutationMessage(data)[action];

                    if (data) {
                        if ([MutationActions.DELETE, MutationActions.CREATE].includes(action)) {
                            if (
                                Object.keys(filters).every(
                                    key => defaultFilters[key] == filters[key]
                                )
                            ) {
                                refetch();
                            } else {
                                setKeyword('');
                                setFilters(defaultFilters);
                            }
                        }

                        if (action == MutationActions.EDIT && getLocationRackData) {
                            if (
                                Object.keys(filters).every(
                                    key => defaultFilters[key] == filters[key]
                                )
                            ) {
                                const { content } = getLocationRackData;

                                setGetLocationRackData({
                                    ...getLocationRackData,
                                    content: content.map(locationRack =>
                                        locationRack.id == formData.id ? formData : locationRack
                                    )
                                });
                            } else {
                                refetch();
                            }
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

    const createLocationRack = () => {
        mutateLocationRack(MutationActions.CREATE, formData);
    };

    const editLocationRack = () => {
        mutateLocationRack(MutationActions.EDIT, formData);
    };

    const removeLocationRack = (id: string | null) => {
        mutateLocationRack(MutationActions.DELETE, { id });
    };

    const finish = () => {
        if (formData.id) {
            editLocationRack();
        } else {
            createLocationRack();
        }
    };

    let locationRacks: TLocationRackInfo[] = [],
        totalElement = 0;

    if (getLocationRackData) {
        locationRacks = getLocationRackData.content.map(locationRack => ({
            ...locationRack,
            createdDate: convertISODate(locationRack.createdDate)
        }));
        totalElement = getLocationRackData.totalElement;
    }

    return (
        <Flex gap="middle" vertical>
            <Flex justify="space-between" gap={16}>
                <Input.Search
                    placeholder="Search position..."
                    allowClear
                    style={{ width: 320 }}
                    onClear={() => {
                        setFilters(defaultFilters);
                    }}
                    onSearch={onSearch}
                    onChange={event => setKeyword(event.target.value)}
                    value={keyword}
                />
                <Button className="w-fit" type="primary" onClick={openForm}>
                    New position
                </Button>
            </Flex>
            <Table<TLocationRackInfo>
                columns={columns}
                dataSource={locationRacks}
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
                title={formData.id ? 'Edit a location rack' : 'Create a new location rack'}
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
                <Form
                    onValuesChange={changedValues => {
                        setFormData({
                            ...formData,
                            ...changedValues
                        });
                    }}
                    initialValues={formData}
                    layout="vertical"
                    onFinish={finish}
                    form={formInstance}
                >
                    <Form.Item
                        name="position"
                        label="Position"
                        rules={[{ required: true, message: 'Please enter position' }]}
                    >
                        <Input placeholder="Please enter position" />
                    </Form.Item>
                </Form>
            </Drawer>
        </Flex>
    );
};

export default LocationRack;
