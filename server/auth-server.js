const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== CONFIG =====
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'watch-shop-secret-key-2025';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/watchshop';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ===== MONGODB CONNECTION =====
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    
    // Initialize admin user if not exists
    try {
      const adminExists = await User.findOne({ email: 'admin@gmail.com' });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('123456', 10);
        const adminUser = new User({
          fullName: 'Administrator',
          email: 'admin@gmail.com',
          phone: '0901234567',
          password: hashedPassword,
          role: 'admin'
        });
        await adminUser.save();
        console.log('✅ Admin user created');
      }
    } catch (err) {
      console.error('Error initializing admin user:', err.message);
    }
  })
  .catch(err => console.error('❌ MongoDB error:', err.message));

// ===== SCHEMAS =====
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  password: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  googleId: { type: String, default: '' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: String,
      name: String,
      brand: String,
      price: Number,
      quantity: Number,
      imageUrl: String
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, default: 'cod' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// ===== HELPERS =====
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

const sanitizeUser = (user) => {
  const userObj = user.toObject();
  return {
    id: userObj._id,
    fullName: userObj.fullName,
    email: userObj.email,
    phone: userObj.phone,
    role: userObj.role,
    googleId: userObj.googleId,
    avatar: userObj.avatar,
    createdAt: userObj.createdAt
  };
};

// ===== AUTH ROUTES =====

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      fullName,
      email,
      phone: phone || '',
      password: hashedPassword,
      role: 'user'
    });

    await user.save();

    const token = generateToken(user);
    const safeUser = sanitizeUser(user);

    res.status(201).json({ user: safeUser, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const safeUser = sanitizeUser(user);

    res.json({ user: safeUser, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Missing idToken' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    });

    const { email, name, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        fullName: name,
        email,
        phone: '',
        password: '',
        avatar: picture,
        googleId: sub,
        role: 'user'
      });
      await user.save();
    } else if (!user.googleId) {
      // Update googleId if not set
      user.googleId = sub;
      if (!user.avatar && picture) {
        user.avatar = picture;
      }
      await user.save();
    }

    const token = generateToken(user);
    const safeUser = sanitizeUser(user);

    res.json({ user: safeUser, token });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

// ===== ORDERS ROUTES =====

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, total, shippingAddress, phone, paymentMethod } = req.body;
    
    console.log('Create order request:', { userId, items, total, shippingAddress, phone, paymentMethod });

    if (!userId || !items || !total || !shippingAddress || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = new Order({
      userId,
      items,
      total,
      shippingAddress,
      phone,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending'
    });

    await order.save();
    const populatedOrder = await order.populate('userId', 'fullName email');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Create order error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'fullName email phone');
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const orders = await Order.find({ userId }).populate('userId', 'fullName email phone');
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId).populate('userId', 'fullName email phone');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
app.patch('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'fullName email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
app.post('/api/orders/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel order in ' + order.status + ' status' });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();
    await order.save();

    const populatedOrder = await order.populate('userId', 'fullName email phone');
    res.json(populatedOrder);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`✅ Backend running: http://localhost:${PORT}`);
});
