# 🚀 Backend Auth Server Setup

## 📋 Yêu cầu

- Node.js >= 14
- npm hoặc yarn

## ⚙️ Cài đặt

### 1. Cài đặt dependencies (nếu chưa có)
```bash
npm install
```

Hoặc cài riêng package cần thiết:
```bash
npm install jsonwebtoken
```

### 2. Kiểm tra cài đặt
```bash
# Kiểm tra xem packages đã có chưa
npm list express cors jsonwebtoken
```

## 🎯 Chạy Backend

### Cách 1: Chạy server (dùng Node.js thường)
```bash
npm run server
```

Output sẽ như thế này:
```
✅ Auth Server đang chạy tại http://localhost:4000
📝 Đăng ký: POST http://localhost:4000/api/auth/register
🔐 Đăng nhập: POST http://localhost:4000/api/auth/login
👥 Danh sách user: GET http://localhost:4000/api/users
```

### Cách 2: Chạy với auto-reload (dùng nodemon - tuỳ chọn)
Cài đặt nodemon (dev dependency):
```bash
npm install --save-dev nodemon
```

Rồi chạy:
```bash
npm run server:dev
```

## 🧪 Test API

### Test Đăng nhập (Admin)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"123456"}'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "u_admin",
    "fullName": "Administrator",
    "email": "admin@gmail.com",
    "phone": "0901234567",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test Đăng ký (User mới)
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"Nguyễn Văn A",
    "email":"user@example.com",
    "phone":"0912345678",
    "password":"MySecurePass123"
  }'
```

**Response:**
```json
{
  "message": "Register successful",
  "user": {
    "id": "u_1705000000000",
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0912345678",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test Health Check
```bash
curl http://localhost:4000/api/health
```

## 🌐 Chạy cả Frontend + Backend

Mở 2 terminal:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Frontend sẽ tự động gọi API tại `http://localhost:4000` (từ `.env.local`)

## 💾 Dữ liệu

User được lưu trong `server/data/users.json`

Để reset data:
1. Xóa file `server/data/users.json`
2. Khởi động lại server

Server sẽ tự động tạo file mới với user admin mặc định.

## 🔐 Tài khoản mặc định

| Email | Password | Role |
|-------|----------|------|
| admin@gmail.com | 123456 | admin |

## 🐛 Troubleshooting

### Lỗi: "Port 4000 already in use"
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :4000
kill -9 <PID>
```

Hoặc chạy server trên port khác:
```bash
PORT=5000 npm run server
```

### Lỗi: "Cannot find module 'jsonwebtoken'"
```bash
npm install jsonwebtoken
```

### Frontend không gọi API được
- Kiểm tra `.env.local` có `VITE_API_URL=http://localhost:4000`
- Đảm bảo backend đang chạy (Terminal hiển thị "Auth Server running")
- Check xem port 4000 có bị block không

## 📝 Ghi chú

- API server sử dụng **CORS** để accept requests từ frontend (localhost:5173)
- JWT token hết hạn sau **7 ngày**
- Password được lưu trong plaintext (demo purposes - **không dùng trong production!**)
- Dữ liệu lưu trong file JSON (có thể thay bằng database sau)

---

Happy coding! 🎉
