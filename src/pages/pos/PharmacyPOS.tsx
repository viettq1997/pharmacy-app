import { useState, useEffect } from 'react';
import {Input, List, Card, Button, message, Typography, Row, Col, AutoComplete, Spin, Tooltip, Modal} from 'antd';
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  UserOutlined,
   WarningTwoTone
} from '@ant-design/icons';
import {GET_MEDICINE_CATEGORIES_PAGINATION} from "@/api/medicineCategory.api.ts";
import useApi from "@/hooks/useApi.tsx";
import {generateBill} from "@/utils/function.ts";
import "./PharmacyPOS.css"
import BaseForm from "@/components/BaseForm.tsx";
import {fields as customerFields} from "@/pages/customer/Customer.data";
import {CartItem, InventoryMed} from "@/types/CartTypes.ts";
import {useAtom} from "jotai/index";
import {stateCart} from "@/states/cart.ts";
import {CustomerInterface} from '@/pages/customer/Customer.type.ts';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;


interface Category {
  "id": string,
  "name": string,
  "description"?: string
  "createdDate"?: string
  "createdBy"?: string
  "updatedDate"?: string
  "updatedBy"?: string
}

interface Customer {
  id: string,
  firstName: string,
  lastName: string,
  age: number,
  sex: string,
  phoneNo: string,
  mail: string,
  value:string,
  label: string
}

export default function PharmacyPOS() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [cart, setCart] = useState<CartItem[]>([]);
  const [cart, setCart] = useAtom(stateCart)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, _setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<InventoryMed[]>([]);
  const [loadingMed, setLoadingMed] = useState<boolean>(false);
  const [_categories, setCategories] = useState<Category[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [searchCustomer, setSearchCustomer] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18
  const [total, setTotal] = useState(0);
  const { get, post} = useApi()
  const getCategories = async () => {
    const params: any = {
      page: 0,
      size: 200,
    }
    const resp = await get(GET_MEDICINE_CATEGORIES_PAGINATION, params)
    setCategories([{id: 'all', name: 'All'}, ...resp.content])
  }

  const handleFinishCustomer = async (values: CustomerInterface) => {
    setLoading(true)
    try {
      const customer = (await post('/customers', {
        ...values,
      }));
      console.log(customer)
      setSelectedCustomer({
        ...customer,
        value: `${customer.phoneNo} (${customer.firstName} ${customer.lastName})`,
        label: `${customer.phoneNo} (${customer.firstName} ${customer.lastName})`,
      })
      message.success('Customer created successfully');
      setIsModalVisible(false);
    } catch (error) {
      console.log(error)
      message.error('Failed to save customer');
    }
    setLoading(false)
  };

  const getMeds = async () => {
    // const filtered = products.filter(product =>
    //   (selectedCategory === 'All' || product.category === selectedCategory) &&
    //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    // setFilteredProducts(filtered);
    setLoadingMed(true)
    const params: any = {
      page: currentPage - 1,
      size: pageSize,
      name: searchTerm || undefined,
      categoryId: selectedCategory === 'all' ? undefined : selectedCategory
    }
    const { content, totalElement } =  await get('reports/inventory', params)
    setFilteredProducts(content);
    setTotal(totalElement)
    setLoadingMed(false)
  }

  useEffect(() => {
    getCategories()
  }, [])
  useEffect(() => {
    getMeds()
  }, [searchTerm, selectedCategory, currentPage]);

  const addToCart = (product: InventoryMed) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setCart(prevCart => {
      return prevCart.reduce((acc, item) => {
        if (item.id === id) {
          if (newQuantity > 0) {
            acc.push({ ...item, quantity: newQuantity });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.medicine.price * item.quantity, 0);
  };

  const printOrder = (order: any) => {
    const listItems = cart.map(c => ({
      quantity: c.quantity,
      name: c.medicine.name,
      price: c.medicine.price,
      amount: c.medicine.price * c.quantity
    }))
    const printContent = generateBill({
      listItems,
      orderCode: order?.code,
      amount: order.totalAmount,
      orderPayTime: dayjs(new Date(order?.createdDate)).format('DD-MM-YYYY HH:mm'),
      totalAmount: listItems.reduce((a, v) => v.amount + a, 0),
    })
    const windowPrint = window.open('');
    windowPrint?.document.write(printContent);
    windowPrint?.document.close();
    setTimeout(() => {
      windowPrint?.focus();
      windowPrint?.print();
      windowPrint?.close();
    }, 1000)
  }

  const handleCheckout = async () => {
    const dataBody = {
      customerId: selectedCustomer?.id,
      usePoint: false,
      saleItems: cart.map(c => ({
        inventoryId: c.id,
        quantity: c.quantity,
        price: c.quantity * c.medicine.price
      }))
    }
    setLoading(true)
    const order = (await post('/sales', dataBody))
    if(order) {
      setSearchTerm('')
      // if (selectedCustomer) {
      //   message.success(`Order placed successfully for ${selectedCustomer.label}!`);
      // } else {
      //   message.success('Order placed successfully!');
      // }
      Modal.success({
        title: selectedCategory ? `Order placed successfully for ${selectedCustomer?.label}!` : 'Order placed successfully!',
        footer: (_, { OkBtn }) => (
            <>
              <Button onClick={() => printOrder(order)}>Print bill</Button>
              <OkBtn />
            </>
        )

      })
      setCart([]);
      setSelectedCustomer(null);
    }
    setLoading(false)
  };

  const handleCustomerSearch = async (value: string) => {
    setSearchCustomer(value)
    const params: any = {
      page: 0,
      size: 100,
      phoneNo: value
    }
    const {content} = await get('/customers', params)
    setCustomerOptions(
      content.map((customer: any) => ({
        ...customer,
        value: `${customer.phoneNo} (${customer.firstName || ''} ${customer.lastName || ''})`,
        label: `${customer.phoneNo} (${customer.firstName || ''} ${customer.lastName || ''})`,
      }))
    );
  };

  const handleCustomerSelect = (value: string) => {
    const selectedCustomer = customerOptions.find(customer => customer.value === value);
    if (selectedCustomer) {
      setSelectedCustomer(selectedCustomer);
      message.success(`Customer ${selectedCustomer.label} added to the order.`);
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="min-h-screen">
        <div className="flex items-center justify-between p-0">
          <Search
            placeholder="Search medicines"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{width: 300, marginRight: 16}} size="large"
          />
          {/*<Menu*/}
          {/*  mode="horizontal" className="bg-none"*/}
          {/*  selectedKeys={[selectedCategory]}*/}
          {/*  onSelect={({key}) => setSelectedCategory(key as string)}*/}
          {/*  style={{flex: 1}}*/}
          {/*>*/}
          {/*  {categories.map(category => (*/}
          {/*    <Menu.Item key={category.id}>{category.name}</Menu.Item>*/}
          {/*  ))}*/}
          {/*</Menu>*/}
        </div>
        <div style={{padding: '24px'}}>
          <Row gutter={24}>
            <Col span={16}>
              <List
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                    setCurrentPage(page)
                  },
                  pageSize: pageSize,
                  total: total,
                  showSizeChanger: false,
                  align: "center"
                }}
                grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3}}
                dataSource={filteredProducts}
                loading={loadingMed}
                renderItem={(product) => (
                  <List.Item className="pos-list-med">
                    <Card
                      hoverable={true}  className={product.isGettingExpire ? 'border-warning' : ''}
                      title={product.medicine.name}
                      extra={product.isGettingExpire ? <Tooltip title='Warning: Medication is about to expire'>
                        <WarningTwoTone style={{fontSize: '1.5rem'}} twoToneColor="#EB772FFF"/>
                      </Tooltip> : <></>}
                      actions={[
                        <Button color="primary"   variant="text" className="add-to-cart" onClick={() => addToCart(product)}>
                          <strong>Add to Cart</strong>
                        </Button>
                      ]}
                    >
                      <p  className={'text-red-500'}>${product.medicine.price.toFixed(2)}</p>
                      <p style={{color: '#a5a5a5', display: 'flex', justifyContent: 'space-between'}}>
                        <span>{product.quantity} in-stock</span>
                        <span>exp: {product.expDate}</span>
                      </p>
                    </Card>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={8}>
              <Card title={<Title level={4}>Cart <ShoppingCartOutlined/></Title>}>
                { !selectedCustomer &&
                  <AutoComplete
                    style={{width: '100%', marginBottom: 16}}
                    options={customerOptions}
                    onSearch={handleCustomerSearch}
                    onSelect={handleCustomerSelect}
                    className={"autocomplete-customer"}
                    placeholder="Search customer by phone or name"
                  >
                    <Input prefix={<UserOutlined/>}
                           suffix={<Tooltip title='Create new customer'><PlusOutlined onClick={() => setIsModalVisible(true)}/></Tooltip>}/>
                  </AutoComplete>
                }
                {!!selectedCustomer && <div className='customer-info'>
                  <div><UserOutlined/> {selectedCustomer?.label}</div>
                    <div><Tooltip title="unuse customer"><DeleteOutlined onClick={() => setSelectedCustomer(null)} /></Tooltip></div>
                </div>}
                <List
                  dataSource={cart}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.medicine.name}
                        description={`$${item.medicine.price.toFixed(2)}`}
                      />
                      <div className="flex items-center">
                        <Button
                          icon={<MinusOutlined/>}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          size="small"
                        />
                        <Input
                          className="mx-2 w-16 text-center"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              updateQuantity(item.id, value);
                            }
                          }}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value) || value < 1) {
                              updateQuantity(item.id, 1);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              updateQuantity(item.id, item.quantity + 1);
                            } else if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              updateQuantity(item.id, Math.max(1, item.quantity - 1));
                            }
                          }}
                        />
                        <Button
                          icon={<PlusOutlined/>}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          size="small"
                        />
                        <Button
                          icon={<DeleteOutlined/>}
                          onClick={() => removeFromCart(item.id)}
                          size="small"
                          className="ml-2"
                          danger
                        />
                      </div>
                    </List.Item>
                  )}
                />
                <div className="mt-4">
                  <Title level={4}>
                    <div className="flex justify-between">
                      <div>Total:</div>
                      <div className={'text-red-500'}>${getTotalPrice().toFixed(2)}</div>
                    </div>
                  </Title>
                  <Button
                    type="primary"
                    size="middle"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className={'w-full'}
                  >
                    Checkout
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <Modal
        title={'Create Customer'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <BaseForm isSubmitting={loading}
                  fields={customerFields()}
                  onFinish={handleFinishCustomer}
                  initialValues={{phoneNo: searchCustomer}}
        />
      </Modal>
    </Spin>
  );
}
