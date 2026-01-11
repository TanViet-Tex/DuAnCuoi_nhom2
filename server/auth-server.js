import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { OAuth2Client } from 'google-auth-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'watch-shop-secret-key-2025';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([
  { id: 'u_admin', fullName: 'Administrator', email: 'admin@gmail.com', phone: '0901234567', password: '123456', role: 'admin' }
], null, 2));
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Tạo JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// API: Đăng ký
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, phone, password } = req.body;
  
  // Validation
  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const users = readUsers();
  
  // Kiểm tra email đã tồn tại
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  // Tạo user mới
  const user = { 
    id: `u_${Date.now()}`, 
    fullName, 
    email, 
    phone: phone || '', 
    password, 
    role: 'user' 
  };
  
  users.push(user);
  writeUsers(users);

  // Tạo token
  const token = generateToken(user);

  // Trả về user (không có password) + token
  const { password: _p, ...userSafe } = user;
  return res.status(201).json({ 
    message: 'Register successful',
    user: userSafe, 
    token 
  });
});

// API: Đăng nhập
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const users = readUsers();
  
  // Tìm user với email + password
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Tạo token
  const token = generateToken(user);

  // Trả về user (không có password) + token
  const { password: _p, ...userSafe } = user;
  return res.json({ 
    message: 'Login successful',
    user: userSafe, 
    token 
  });
});

// API: Đăng nhập với Google
app.post('/api/auth/google', async (req, res) => {
  const { idToken } = req.body;
  
  if (!idToken) {
    return res.status(400).json({ message: 'Missing idToken' });
  }

  try {
    // Xác thực idToken với Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    const users = readUsers();

    // Tìm user có email từ Google
    let user = users.find(u => u.email === email);

    // Nếu user không tồn tại, tạo user mới
    if (!user) {
      user = {
        id: `u_google_${sub}`,
        fullName: name || 'Google User',
        email,
        phone: '',
        password: '', // Google users không có password
        avatar: picture || '',
        role: 'user',
        googleId: sub,
      };
      users.push(user);
      writeUsers(users);
    }

    // Tạo JWT token
    const token = generateToken(user);

    // Trả về user (không có password) + token
    const { password: _p, ...userSafe } = user;
    return res.status(200).json({
      message: 'Google login successful',
      user: userSafe,
      token,
    });
  } catch (error) {
    console.error('Google token verification failed:', error);
    return res.status(401).json({
      message: 'Invalid or expired idToken',
      error: error.message,
    });
  }
});

// API: Lấy danh sách tất cả user (dùng cho admin)
app.get('/api/users', (req, res) => {
  const users = readUsers();
  const safe = users.map(({ password, ...rest }) => rest);
  res.json(safe);
});

// ============= ORDERS API =============

// API: Tạo đơn hàng
app.post('/api/orders', (req, res) => {
  const { userId, items, total, shippingAddress, phone, paymentMethod } = req.body;
  
  // Validation
  if (!userId || !items || !total || !shippingAddress || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Items must be a non-empty array' });
  }

  // Verify user exists
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Tạo order mới
  const order = {
    id: `order_${Date.now()}`,
    userId,
    items,
    total,
    status: 'pending',
    shippingAddress,
    phone,
    paymentMethod: paymentMethod || 'cod',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const orders = readOrders();
  orders.push(order);
  writeOrders(orders);

  return res.status(201).json({
    message: 'Order created successfully',
    order
  });
});

// API: Lấy đơn hàng của user
app.get('/api/orders/user/:userId', (req, res) => {
  const { userId } = req.params;
  const orders = readOrders();
  const userOrders = orders.filter(o => o.userId === userId);
  res.json(userOrders);
});

// API: Lấy chi tiết một đơn hàng (specific route BEFORE general route)
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const orders = readOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found', order: null });
  }
  
  res.json({ order });
});

// API: Lấy tất cả đơn hàng (admin) - GENERAL ROUTE AFTER SPECIFIC
app.get('/api/orders', (req, res) => {
  const orders = readOrders();
  res.json({ orders });
});

// API: Cập nhật trạng thái đơn hàng (admin)
app.put('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const orders = readOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  order.status = status;
  order.updatedAt = new Date().toISOString();
  writeOrders(orders);
  
  res.json({ message: 'Order updated successfully', order });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Auth server is running', timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`\n✅ Auth Server đang chạy tại http://localhost:${port}`);
  console.log(`📝 Đăng ký: POST http://localhost:${port}/api/auth/register`);
  console.log(`🔐 Đăng nhập: POST http://localhost:${port}/api/auth/login`);
  console.log(`🔓 Google OAuth: POST http://localhost:${port}/api/auth/google`);
  console.log(`👥 Danh sách user: GET http://localhost:${port}/api/users`);
  console.log(`\n🛒 Orders API:`);
  console.log(`📦 Tạo đơn: POST http://localhost:${port}/api/orders`);
  console.log(`📋 Đơn của user: GET http://localhost:${port}/api/orders/user/:userId`);
  console.log(`📊 Tất cả đơn: GET http://localhost:${port}/api/orders`);
  console.log(`🔍 Chi tiết đơn: GET http://localhost:${port}/api/orders/:orderId`);
  console.log(`✏️  Cập nhật đơn: PUT http://localhost:${port}/api/orders/:orderId\n`);
});
