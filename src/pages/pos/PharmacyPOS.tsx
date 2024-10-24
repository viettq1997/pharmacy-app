import { useState, useEffect } from 'react';
import { Layout, Input, Menu, List, Card, Button, message, Typography, Row, Col, Tag, AutoComplete } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  prescription: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
}

const products: Product[] = [
  { id: 1, name: "Aspirin", price: 5.99, category: "Pain Relief", prescription: false },
  { id: 2, name: "Amoxicillin", price: 12.99, category: "Antibiotics", prescription: true },
  { id: 3, name: "Loratadine", price: 8.99, category: "Allergy", prescription: false },
  { id: 4, name: "Ibuprofen", price: 6.99, category: "Pain Relief", prescription: false },
  { id: 5, name: "Omeprazole", price: 15.99, category: "Digestive Health", prescription: true },
  { id: 6, name: "Vitamin C", price: 9.99, category: "Vitamins", prescription: false },
  { id: 7, name: "Metformin", price: 14.99, category: "Diabetes", prescription: true },
  { id: 8, name: "Cetirizine", price: 7.99, category: "Allergy", prescription: false },
];

const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

// Mock customer data
const customers: Customer[] = [
  { id: 1, name: "John Doe", phone: "1234567890" },
  { id: 2, name: "Jane Smith", phone: "9876543210" },
];

export default function PharmacyPOS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOptions, setCustomerOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const filtered = products.filter(product =>
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory]);

  const addToCart = (product: Product) => {
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

  const updateQuantity = (id: number, newQuantity: number) => {
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

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (selectedCustomer) {
      message.success(`Order placed successfully for ${selectedCustomer.name}!`);
    } else {
      message.success('Order placed successfully!');
    }
    setCart([]);
    setSelectedCustomer(null);
  };

  const handleCustomerSearch = (value: string) => {
    const matchedCustomers = customers.filter(
      customer => customer.phone.includes(value) || customer.name.toLowerCase().includes(value.toLowerCase())
    );
    setCustomerOptions(
      matchedCustomers.map(customer => ({
        value: customer.phone,
        label: `${customer.name} (${customer.phone})`,
      }))
    );
  };

  const handleCustomerSelect = (value: string) => {
    const selectedCustomer = customers.find(customer => customer.phone === value);
    if (selectedCustomer) {
      setSelectedCustomer(selectedCustomer);
      message.success(`Customer ${selectedCustomer.name} added to the order.`);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white flex items-center justify-between p-0">
        <Search
          placeholder="Search medicines"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, marginRight: 16 }}
        />
        <Menu
          mode="horizontal"
          selectedKeys={[selectedCategory]}
          onSelect={({ key }) => setSelectedCategory(key as string)}
          style={{ flex: 1 }}
        >
          {categories.map(category => (
            <Menu.Item key={category}>{category}</Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Row gutter={24}>
          <Col span={16}>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
              dataSource={filteredProducts}
              renderItem={(product) => (
                <List.Item>
                  <Card
                    title={product.name}
                    extra={product.prescription ? <Tag color="red">Rx</Tag> : <Tag color="green">OTC</Tag>}
                  >
                    <p>${product.price.toFixed(2)}</p>
                    <p>{product.category}</p>
                    <Button type="primary" onClick={() => addToCart(product)}>
                      Add to Cart
                    </Button>
                  </Card>
                </List.Item>
              )}
            />
          </Col>
          <Col span={8}>
            <Card title={<Title level={4}>Shopping Cart <ShoppingCartOutlined /></Title>}>
              <AutoComplete
                style={{ width: '100%', marginBottom: 16 }}
                options={customerOptions}
                onSearch={handleCustomerSearch}
                onSelect={handleCustomerSelect}
                placeholder="Search customer by phone or name"
              >
                <Input prefix={<UserOutlined />} />
              </AutoComplete>
              {selectedCustomer && (
                <p className="mb-4">Customer: {selectedCustomer.name} ({selectedCustomer.phone})</p>
              )}
              <List
                dataSource={cart}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.name}
                      description={`$${item.price.toFixed(2)} ${item.prescription ? '(Rx)' : '(OTC)'}`}
                    />
                    <div className="flex items-center">
                      <Button
                        icon={<MinusOutlined />}
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
                        icon={<PlusOutlined />}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        size="small"
                      />
                      <Button
                        icon={<DeleteOutlined />}
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
      </Content>
    </Layout>
  );
}
