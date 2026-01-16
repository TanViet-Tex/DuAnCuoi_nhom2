const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/watchshop';

mongoose.connect(MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');

  const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: String,
    avatar: String,
    createdAt: { type: Date, default: Date.now }
  });

  const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    total: Number,
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingAddress: String,
    phone: String,
    paymentMethod: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  const User = mongoose.model('User', userSchema);
  const Order = mongoose.model('Order', orderSchema);

  try {
    // Create test user
    const testUser = new User({
      fullName: 'Test User',
      email: `testuser_${Date.now()}@test.com`,
      phone: '0987654321',
      password: 'hashed_password',
      role: 'user'
    });
    const savedUser = await testUser.save();
    console.log('✅ Test user created:', savedUser._id);

    // Create test order
    const order = new Order({
      userId: savedUser._id,
      items: [
        {
          productId: 'p1',
          name: 'Test Product',
          price: 100000,
          quantity: 1
        }
      ],
      total: 100000,
      shippingAddress: '123 Main St, Test City',
      phone: '0987654321',
      paymentMethod: 'cod'
    });
    const savedOrder = await order.save();
    console.log('✅ Test order created:', savedOrder._id);

    // Fetch order with user info
    const populatedOrder = await Order.findById(savedOrder._id).populate('userId', 'fullName email phone');
    console.log('✅ Populated order:', JSON.stringify(populatedOrder, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
});
