# Orders API - Quick Reference

## 🚀 Quick Start

### Start Servers
```bash
# Terminal 1: Backend (port 4000)
npm run server

# Terminal 2: Frontend (port 5173/5174)
npm run dev
```

### Access Application
- Frontend: http://localhost:5173 (or 5174)
- Backend: http://localhost:4000
- Health Check: http://localhost:4000/api/health

---

## 📊 API Endpoints Overview

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/orders` | Create order | User |
| GET | `/api/orders` | Get all orders | Admin |
| GET | `/api/orders/user/:userId` | Get user orders | User |
| GET | `/api/orders/:orderId` | Get order details | User |
| PUT | `/api/orders/:orderId` | Update status | Admin |

---

## 💾 Data Schema

```typescript
interface Order {
  id: string;                    // order_<timestamp>
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: string;
  phone: string;
  paymentMethod: 'cod' | 'transfer';
  createdAt: string;            // ISO date
  updatedAt: string;            // ISO date
}

interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
```

---

## 🎯 Frontend Components

### Checkout.tsx
- **Path**: `src/pages/Checkout.tsx`
- **Purpose**: Create orders
- **Key Function**: `handleSubmit()` → POST /api/orders
- **Storage**: SessionStorage → `lastOrder`

### OrderSuccess.tsx
- **Path**: `src/pages/OrderSuccess.tsx`
- **Purpose**: Show order confirmation
- **Route**: `/order-success/:orderId`
- **Data Source**: SessionStorage or API

### Admin Orders.tsx
- **Path**: `src/pages/admin/Orders.tsx`
- **Purpose**: Manage orders
- **Route**: `/admin/orders`
- **Features**: List orders, update status

---

## 🔌 API Testing

### cURL Examples

```bash
# Create order
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "items": [{
      "productId": "p1",
      "name": "Watch",
      "brand": "Rolex",
      "price": 50000,
      "quantity": 1,
      "imageUrl": "https://..."
    }],
    "total": 50000,
    "shippingAddress": "123 Main St",
    "phone": "0912345678",
    "paymentMethod": "cod"
  }'

# Get all orders
curl http://localhost:4000/api/orders

# Get order by ID
curl http://localhost:4000/api/orders/order_1704984001

# Update order status
curl -X PUT http://localhost:4000/api/orders/order_1704984001 \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}'
```

### PowerShell Examples

```powershell
# Create order
$body = @{
  userId = "user_123"
  items = @(@{
    productId = "p1"
    name = "Watch"
    brand = "Rolex"
    price = 50000
    quantity = 1
    imageUrl = "https://..."
  })
  total = 50000
  shippingAddress = "123 Main St"
  phone = "0912345678"
  paymentMethod = "cod"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/orders" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# Get all orders
Invoke-WebRequest -Uri "http://localhost:4000/api/orders" -UseBasicParsing | ConvertFrom-Json
```

---

## 📁 Directory Structure

```
project/
├── server/
│   ├── auth-server.js          # Backend API
│   └── data/
│       └── orders.json         # Order storage
├── src/
│   ├── pages/
│   │   ├── Checkout.tsx        # Create orders
│   │   ├── OrderSuccess.tsx    # Confirm orders
│   │   └── admin/
│   │       └── Orders.tsx      # Admin dashboard
│   └── components/
│       └── admin/
│           └── OrdersTable.tsx # Order list
└── ORDERS_API_GUIDE.md         # Full documentation
```

---

## 🔄 Order Status Flow

```
pending (Chờ xử lý)
    ↓
processing (Đang xử lý)
    ↓
completed (Hoàn thành)

         OR
         ↓
    cancelled (Đã hủy)
```

---

## 🐛 Debugging Tips

### Check Backend Logs
```bash
# Watch backend output
npm run server
# Look for: ✅ Auth Server đang chạy...
```

### Check SessionStorage
```javascript
// In browser console
sessionStorage.getItem('lastOrder')
```

### Check Orders File
```bash
# View orders.json
type server/data/orders.json  # Windows
cat server/data/orders.json   # Linux/Mac
```

### Monitor Network Requests
- Open DevTools (F12)
- Go to Network tab
- Perform action (create order)
- Check request/response

---

## ✅ Common Tasks

### Create New Order
1. Login as user
2. Add items to cart
3. Go to checkout
4. Fill shipping info
5. Select payment method
6. Click "Đặt hàng"
7. See order success page

### View Order Details
1. As customer: Go to Profile
2. As admin: Go to /admin/orders
3. Find order by ID
4. View all details

### Update Order Status
1. Go to /admin/orders
2. Find order in table
3. Click status dropdown
4. Select new status
5. Save changes (auto-saves)

### Check Order in Database
```bash
cd server/data
cat orders.json | grep order_id
```

---

## 🚨 Troubleshooting

### Orders not saving
- [ ] Backend running? `npm run server`
- [ ] orders.json exists? `server/data/orders.json`
- [ ] No port conflicts? Check port 4000

### Order success page blank
- [ ] SessionStorage has lastOrder?
- [ ] OrderId in URL correct?
- [ ] Backend API responding?

### Admin status update not working
- [ ] Backend running?
- [ ] Correct orderId?
- [ ] Status value valid?

### CORS errors
- [ ] Backend has CORS enabled
- [ ] Check allowed origins
- [ ] Clear browser cache

---

## 📊 Performance Tips

### Optimize Images
- Use optimized image URLs
- Consider CDN for product images
- Lazy load order items

### Database Migration
- Consider MongoDB for scale
- Index orders by userId
- Index orders by status

### Caching
- Cache user orders
- Cache order details
- Use Redis for session

---

## 🔒 Security Checklist

- [ ] Validate all inputs
- [ ] Verify user ownership
- [ ] Protect admin routes
- [ ] Sanitize output
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Log all operations
- [ ] Encrypt sensitive data

---

## 📚 Resources

- **Full Guide**: [ORDERS_API_GUIDE.md](ORDERS_API_GUIDE.md)
- **Implementation**: [ORDERS_API_IMPLEMENTATION.md](ORDERS_API_IMPLEMENTATION.md)
- **GitHub**: [Repository Link](https://github.com/TanViet-Tex/DuAnCuoi_nhom2)

---

## 📞 Support

### For Issues
1. Check logs: `npm run server`
2. Check console: Browser DevTools
3. Review docs: ORDERS_API_GUIDE.md
4. Check GitHub: Issue tracker

### Common Errors
- "Order not found" → Check orderId parameter
- "Missing required fields" → Validate form data
- "User not found" → Verify userId exists
- "Cannot update" → Check order exists

---

**Last Updated**: January 2024
**Version**: 1.0
**Status**: ✅ Active
