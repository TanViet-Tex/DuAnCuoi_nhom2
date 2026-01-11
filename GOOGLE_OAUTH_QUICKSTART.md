# 🔐 Google OAuth 2.0 Integration - Quick Start Guide

## ✅ What's Completed

### Backend (Node.js/Express)
- ✅ **POST /api/auth/google** endpoint
- ✅ Google idToken verification using `google-auth-library`
- ✅ Automatic user creation if email doesn't exist
- ✅ JWT token generation (7 days expiry)
- ✅ User data persistence in `users.json`

### Frontend (React)
- ✅ **Login page** updated with Google Login button
- ✅ **AuthContext** with `loginWithGoogle()` method
- ✅ Integration with `@react-oauth/google` library
- ✅ Environment variable support

### Configuration
- ✅ `.env` file setup template
- ✅ Environment variable documentation

## 🚀 How to Use

### 1. Get Google Client ID

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credential (Web application type)
5. Add authorized redirect URI:
   - `http://localhost:5173` or `http://localhost:5174`
   - Your production domain
6. Copy the Client ID

### 2. Configure Environment Variables

Update `.env` file in project root:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
VITE_API_URL=http://localhost:4000
```

For backend, set environment variable:
```bash
# On Windows PowerShell
$env:GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com"

# Or update .env and load it
```

### 3. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd d:\Watch\projectend
npm run server
```

Expected output:
```
✅ Auth Server đang chạy tại http://localhost:4000
📝 Đăng ký: POST http://localhost:4000/api/auth/register
🔐 Đăng nhập: POST http://localhost:4000/api/auth/login
🔓 Google OAuth: POST http://localhost:4000/api/auth/google
👥 Danh sách user: GET http://localhost:4000/api/users
```

**Terminal 2 - Frontend:**
```bash
cd d:\Watch\projectend
npm run dev
```

Expected output:
```
ROLLDOWN-VITE v7.2.5  ready in 383 ms
➜  Local:   http://localhost:5174/
```

### 4. Test Google Login

1. Navigate to `http://localhost:5174/login`
2. Click the Google Login button
3. Sign in with your Google account
4. Check backend logs for token verification
5. Should redirect to home page with logged-in status

## 📂 File Changes

### Backend
- **server/auth-server.js** - Added POST /api/auth/google endpoint
  - Verifies idToken with google-auth-library
  - Creates user if not exists
  - Generates JWT token

### Frontend
- **src/contexts/AuthContext.tsx** - Added loginWithGoogle() method
- **src/pages/Login.tsx** - Integrated GoogleLogin component
- **vite.config.ts** - Updated server configuration
- **.env** - Environment variables for Google OAuth
- **GOOGLE_OAUTH_SETUP.md** - Complete setup documentation

## 🔧 API Endpoint Details

### POST /api/auth/google

**Request:**
```bash
curl -X POST http://localhost:4000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."}'
```

**Response (200 OK):**
```json
{
  "message": "Google login successful",
  "user": {
    "id": "u_google_1234567890",
    "fullName": "John Doe",
    "email": "john@gmail.com",
    "phone": "",
    "avatar": "https://lh3.googleusercontent.com/...",
    "role": "user",
    "googleId": "1234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired idToken",
  "error": "Token verification failed"
}
```

## 🔄 User Flow

```
User clicks "Sign in with Google"
        ↓
Google OAuth popup opens
        ↓
User selects Google account & consents
        ↓
Google returns idToken
        ↓
Frontend sends idToken to /api/auth/google
        ↓
Backend verifies idToken with Google
        ↓
Backend checks if user exists (by email)
        ↓
If NO → Create new user in users.json
        ↓
Backend generates JWT token (7 days)
        ↓
Backend returns user + JWT token
        ↓
Frontend stores token in sessionStorage
        ↓
Frontend redirects to home page
```

## 📊 User Data Example

### Google User (auto-created)
```json
{
  "id": "u_google_1234567890",
  "fullName": "John Doe",
  "email": "john@gmail.com",
  "phone": "",
  "password": "",
  "avatar": "https://lh3.googleusercontent.com/a/...",
  "role": "user",
  "googleId": "1234567890"
}
```

### Traditional User (register/login)
```json
{
  "id": "u_1234567890",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "0987654321",
  "password": "hashedPassword",
  "role": "user"
}
```

## ⚠️ Important Notes

1. **Client ID Format:** Must match `YOUR_CLIENT_ID.apps.googleusercontent.com`
2. **Token Expiry:** Google idTokens expire ~1 hour, JWT tokens 7 days
3. **CORS:** Backend already has CORS enabled for local development
4. **Redirect URIs:** Must add `http://localhost:5173` (or 5174) to Google Console
5. **Email Unique:** Only one account per email (Google or traditional)

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid Client ID" | Check GOOGLE_CLIENT_ID in .env matches Google Console |
| CORS Error | Verify backend has cors() middleware |
| Token Verification Failed | Ensure idToken is fresh (not expired) |
| User Not Found After Login | Check users.json file permissions |
| Port Already in Use | Kill process or use different port |

## 📚 Additional Resources

- Full setup guide: [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
- React OAuth Library: https://www.npmjs.com/package/@react-oauth/google

## ✨ Next Steps

1. Get your Google Client ID from Google Cloud Console
2. Update `.env` with your Client ID
3. Start both servers and test
4. Deploy to production (update Authorized URIs in Google Console)

Happy coding! 🚀
