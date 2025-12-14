// Mock admin data service for dashboard
export type RevenuePoint = { month: string; value: number };
export type ProductItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  status: 'Còn hàng' | 'Hết hàng';
};
export type OrderItem = {
  id: string;
  customer: string;
  total: number;
  status: 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  date: string;
};
export type UserItem = { id: string; name: string; email: string; role: 'user' | 'admin'; locked?: boolean };

const STORAGE_PRODUCTS = 'admin_products_v1';
const STORAGE_ORDERS = 'admin_orders_v1';
const STORAGE_USERS = 'admin_users_v1';

export const getStats = () => {
  // Compute stats from stored data for more realistic values
  const products = loadProducts();
  const orders = loadOrders();
  const users = loadUsers();

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const uniqueCustomers = new Set(orders.map((o) => o.customer)).size;

  return {
    revenue, // total revenue from orders (VND)
    orders: orders.length,
    // Prefer counting registered users as customers if available, otherwise use unique customers from orders
    customers: users && users.length > 0 ? users.length : uniqueCustomers,
    products: products.length,
  };
};

export const getRevenueSeries = (): RevenuePoint[] => {
  return [
    { month: 'T1', value: 280 },
    { month: 'T2', value: 420 },
    { month: 'T3', value: 350 },
    { month: 'T4', value: 480 },
    { month: 'T5', value: 520 },
    { month: 'T6', value: 610 },
    { month: 'T7', value: 700 },
  ];
};

const defaultProducts: ProductItem[] = [
  { id: 'p1', name: 'ROLEX', brand: 'Rolex', price: 15000000, stock: 12, status: 'Còn hàng' },
  { id: 'p2', name: 'DIAMOND D', brand: 'Diamond', price: 8500000, stock: 8, status: 'Còn hàng' },
  { id: 'p3', name: 'SEIKO', brand: 'Seiko', price: 6200000, stock: 0, status: 'Hết hàng' },
];

const defaultOrders: OrderItem[] = [
  { id: '#ORD-1234', customer: 'Nguyễn Văn A', total: 15000000, status: 'Hoàn thành', date: '2025-12-11' },
  { id: '#ORD-1229', customer: 'Trần Thị B', total: 8500000, status: 'Chờ xác nhận', date: '2025-12-10' },
  { id: '#ORD-1218', customer: 'Lê Minh C', total: 6200000, status: 'Đang giao', date: '2025-12-09' },
];

const defaultUsers: UserItem[] = [
  { id: 'u1', name: 'Nguyễn Văn A', email: 'a@example.com', role: 'user' },
  { id: 'u2', name: 'Trần Thị B', email: 'b@example.com', role: 'user' },
  { id: 'u3', name: 'Admin', email: 'admin@gmail.com', role: 'admin' },
];

export const loadProducts = (): ProductItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return defaultProducts;
};

export const saveProducts = (items: ProductItem[]) => {
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(items));
};

export const loadOrders = (): OrderItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return defaultOrders;
};

export const saveOrders = (items: OrderItem[]) => {
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(items));
};

export const loadUsers = (): UserItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return defaultUsers;
};

export const saveUsers = (items: UserItem[]) => {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(items));
};

export const getTopProducts = (): ProductItem[] => loadProducts();
export const getRecentOrders = (): OrderItem[] => loadOrders();
