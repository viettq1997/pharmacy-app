import { useState, useEffect } from 'react';
import {Input, Menu, List, Card, Button, message, Typography, Row, Col, AutoComplete, Spin} from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import {GET_MEDICINE_CATEGORIES_PAGINATION} from "@/api/medicineCategory.api.ts";
import useApi from "@/hooks/useApi.tsx";
import {generateBill} from "@/utils/function.ts";

const { Title } = Typography;
const { Search } = Input;

interface InventoryMed {
  "id": string,
  "quantity": number,
  "expDate": string,
  "mfgDate": string,
  "isGettingExpire": string,
  locationRack: {
    id: string
    position: string
  },
  medicine: {
    "id": string,
    "name": string,
    "price": number,
    "categoryId": string,
    "createdDate": string,
    "createdBy": string,
    "updatedDate": string,
    "updatedBy": string,
  }
}

interface Category {
  "id": string,
  "name": string,
  "description"?: string
  "createdDate"?: string
  "createdBy"?: string
  "updatedDate"?: string
  "updatedBy"?: string
}

interface CartItem extends InventoryMed {
  quantity: number;
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
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<InventoryMed[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const { get, post, put, del } = useApi()
  const getCategories = async () => {
    const params: any = {
      page: 0,
      size: 200,
    }
    const resp = await get(GET_MEDICINE_CATEGORIES_PAGINATION, params)
    setCategories([{id: 'all', name: 'All'}, ...resp.content])
  }

  const getMeds = async () => {
    // const filtered = products.filter(product =>
    //   (selectedCategory === 'All' || product.category === selectedCategory) &&
    //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    // setFilteredProducts(filtered);
    const params: any = {
      page: currentPage - 1,
      size: pageSize,
      keyword: searchTerm || undefined,
      categoryId: selectedCategory === 'all' ? undefined : selectedCategory
    }
    const { content, totalElement } =  await get('reports/inventory', params)
    setFilteredProducts(content);
    setTotal(totalElement)
  }

  useEffect(() => {
    getCategories()
  }, [])
  useEffect(() => {
    getMeds()
  }, [searchTerm, selectedCategory]);

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
    const order = (await post('/sales', dataBody))?.content
    if(order) {
      if (selectedCustomer) {
        message.success(`Order placed successfully for ${selectedCustomer.label}!`);
      } else {
        message.success('Order placed successfully!');
      }
      const listItems = cart.map(c => ({
        quantity: c.quantity,
        name: c.medicine.name,
        price: c.medicine.price,
        amount: c.medicine.price * c.quantity
      }))
      const printContent = generateBill({
        listItems,
        orderCode: order?.id,
        amount: order.totalAmount,
        orderPayTime: order?.createdAt,
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
      setCart([]);
      setSelectedCustomer(null);
    }
    setLoading(false)
  };

  const handleCustomerSearch = async (value: string) => {
    const params: any = {
      page: 0,
      size: 100,
      phoneNo: value
    }
    const {content} = await get('/customers', params)
    setCustomerOptions(
      content.map((customer: any) => ({
        ...customer,
        value: `${customer.phoneNo} (${customer.firstName} ${customer.lastName})`,
        label: `${customer.phoneNo} (${customer.firstName} ${customer.lastName})`,
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
          <Menu
            mode="horizontal" className="bg-none"
            selectedKeys={[selectedCategory]}
            onSelect={({key}) => setSelectedCategory(key as string)}
            style={{flex: 1}}
          >
            {categories.map(category => (
              <Menu.Item key={category.id}>{category.name}</Menu.Item>
            ))}
          </Menu>
        </div>
        <div style={{padding: '24px'}}>
          <Row gutter={24}>
            <Col span={16}>
              <List
                grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3}}
                dataSource={filteredProducts}
                renderItem={(product) => (
                  <List.Item>
                    <Card
                      title={product.medicine.name}
                      // extra={product.prescription ? <Tag color="red">Rx</Tag> : <Tag color="green">OTC</Tag>}
                    >
                      <p>${product.medicine.price.toFixed(2)}</p>
                      <p style={{color: '#a5a5a5', display: 'flex', justifyContent: 'space-between'}}>
                        <span>{product.quantity} in-stock</span>
                        <span>exp: {product.expDate}</span>
                      </p>
                      <Button type="primary" onClick={() => addToCart(product)}>
                        Add to Cart
                      </Button>
                    </Card>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={8}>
              <Card title={<Title level={4}>Shopping Cart <ShoppingCartOutlined/></Title>}>
                <AutoComplete
                  style={{width: '100%', marginBottom: 16}}
                  options={customerOptions}
                  onSearch={handleCustomerSearch}
                  onSelect={handleCustomerSelect}
                  placeholder="Search customer by phone or name"
                >
                  <Input prefix={<UserOutlined/>}/>
                </AutoComplete>
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
                  <Title level={4}>Total: ${getTotalPrice().toFixed(2)}</Title>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                  >
                    Checkout
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
}
