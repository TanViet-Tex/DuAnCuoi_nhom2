# 🔐 Google OAuth 2.0 Implementation Summary

## ✅ What's Been Implemented

### 1. **Backend (Node.js/Express)**

#### New Endpoint: `POST /api/auth/google`
- **Location:** `server/auth-server.js`
- **Functionality:**
  - Receives Google idToken from frontend
  - Verifies token signature with Google's servers using `google-auth-library`
  - Extracts user info (email, name, picture, googleId)
  - Checks if user already exists by email
  - **Auto-creates new user** if email not found
  - Generates JWT token (expires in 7 days)
  - Returns user profile + JWT token

#### Dependencies Added:
```bash
npm install google-auth-library @react-oauth/google
```

**Key Code:**
```javascript
app.post('/api/auth/google', async (req, res) => {
  const { idToken } = req.body;
  
  // Verify idToken with Google
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  
  // Create user if not exists
  // Generate JWT token
  // Return user + token
});
```

---

### 2. **Frontend (React + TypeScript)**

#### Updated Files:

**A) AuthContext.tsx**
- Added `User` interface fields: `avatar`, `googleId`
- Added `loginWithGoogle(idToken: string)` method
- Method sends idToken to backend and stores JWT token
- Follows same pattern as traditional login (try API, fallback to localStorage)

**B) Login.tsx**
- Integrated `@react-oauth/google` library
- Added `GoogleOAuthProvider` wrapper
- Added `GoogleLogin` component
- Added handlers: `handleGoogleSuccess()`, `handleGoogleError()`
- Replaces old custom Google button with official Google component

**Key Code:**
```tsx
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={handleGoogleError}
  />
</GoogleOAuthProvider>
```

---

### 3. **Environment Configuration**

#### `.env` File
```env
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
JWT_SECRET=watch-shop-secret-key-2025
PORT=4000
```

#### Vite Config Updates
- Added server port configuration for development
- Environment variables auto-loaded by Vite

---

### 4. **Helper Scripts**

#### `configure-google-oauth.js`
Interactive script to get Client ID and update `.env`:
```bash
npm run setup:google
```

#### `start-dev.js`
Starts both backend and frontend servers together:
```bash
npm start
```

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      GOOGLE LOGIN FLOW                      │
└─────────────────────────────────────────────────────────────┘

Frontend (React)
├─ User clicks "Sign in with Google"
├─ @react-oauth/google opens Google OAuth popup
├─ User selects account & consents
├─ Google returns idToken (JWT signed by Google)
├─ Frontend receives idToken
└─ POST /api/auth/google with { idToken }
          ↓
Backend (Node.js)
├─ Receives idToken
├─ Creates OAuth2Client with GOOGLE_CLIENT_ID
├─ Calls googleClient.verifyIdToken(idToken)
├─ Google validates signature & returns payload
├─ Extracts: { email, name, picture, sub (googleId) }
├─ Reads users.json
├─ Searches for user by email
│
├─ IF user exists:
│  └─ Uses existing user
│
├─ IF user NOT exists:
│  ├─ Creates new user object:
│  │  {
│  │    id: "u_google_1234567890",
│  │    fullName: "John Doe",
│  │    email: "john@gmail.com",
│  │    phone: "",
│  │    password: "",
│  │    avatar: "https://...",
│  │    role: "user",
│  │    googleId: "1234567890"
│  │  }
│  └─ Saves to users.json
│
├─ Generates JWT token (7 days expiry)
├─ Returns { user, token }
│
└─ Sends response to frontend
          ↓
Frontend
├─ Receives user + token
├─ Stores user in state
├─ Stores token in sessionStorage
├─ Stores profile in localStorage.user_profiles
└─ Redirects to home page ✅
```

---

## 🗄️ Database Schema

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

**Key Differences:**
- Google users: No password, has googleId, avatar from Google
- Traditional users: Has password, no googleId, no avatar

---

## 🔧 All API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Traditional user registration |
| POST | `/api/auth/login` | Traditional user login |
| **POST** | **`/api/auth/google`** | **Google OAuth login (NEW)** |
| GET | `/api/users` | Get all users (admin) |
| GET | `/api/health` | Health check |

---

## 📁 Files Modified/Created

### Created:
- ✅ `.env` - Environment variables
- ✅ `.env.example` - Template for developers
- ✅ `GOOGLE_OAUTH_SETUP.md` - Detailed setup guide
- ✅ `GOOGLE_OAUTH_QUICKSTART.md` - Quick reference
- ✅ `configure-google-oauth.js` - Interactive setup script
- ✅ `start-dev.js` - Combined server starter
- ✅ `IMPLEMENTATION_SUMMARY.md` - This file

### Modified:
- ✅ `server/auth-server.js` - Added Google OAuth endpoint
- ✅ `src/contexts/AuthContext.tsx` - Added loginWithGoogle method
- ✅ `src/pages/Login.tsx` - Integrated Google Login button
- ✅ `vite.config.ts` - Updated server config
- ✅ `package.json` - Added new npm scripts

---

## 🚀 Getting Started

### Step 1: Get Google Client ID
Visit: https://console.cloud.google.com/
- Create project
- Enable Google+ API
- Create OAuth 2.0 credentials (Web app)
- Add redirect URIs: `http://localhost:5173`, `http://localhost:5174`
- Copy Client ID

### Step 2: Configure
```bash
npm run setup:google
# Enter your Google Client ID when prompted
```

### Step 3: Start Servers
```bash
# Option A: Start both together
npm start

# Option B: Start separately
Terminal 1: npm run server
Terminal 2: npm run dev
```

### Step 4: Test
1. Go to http://localhost:5173 (or 5174)
2. Click "Sign in with Google"
3. Sign in with your Google account
4. Check that you're logged in ✅

---

## 🔒 Security Features

1. **Token Verification:**
   - Backend verifies idToken directly with Google
   - Not relying on frontend-only validation

2. **No Password Storage:**
   - Google users don't have passwords
   - Passwords only for traditional auth

3. **JWT Expiry:**
   - Frontend tokens expire after 7 days
   - Users need to re-authenticate after expiry

4. **Session Management:**
   - Token stored in sessionStorage (not localStorage)
   - Cleared on browser close
   - Profile data in localStorage for persistence

5. **Email Uniqueness:**
   - Only one account per email (Google or traditional)
   - Prevents duplicate accounts

---

## 🧪 Testing Commands

### Test with cURL
```bash
# Get a valid Google idToken first, then:
curl -X POST http://localhost:4000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_GOOGLE_ID_TOKEN_HERE"
  }'
```

### Test Backend Server
```bash
npm run server

# Expected output:
# ✅ Auth Server đang chạy tại http://localhost:4000
# 🔓 Google OAuth: POST http://localhost:4000/api/auth/google
```

### Test Frontend Login
```bash
npm run dev

# Go to http://localhost:5173/login
# Click "Sign in with Google"
```

---

## 📚 Documentation Files

1. **GOOGLE_OAUTH_SETUP.md** - Complete setup guide with architecture
2. **GOOGLE_OAUTH_QUICKSTART.md** - Quick reference and troubleshooting
3. **IMPLEMENTATION_SUMMARY.md** - This file with technical details

---

## ⚙️ Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_GOOGLE_CLIENT_ID` | Frontend Google Client ID | `abc123.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_ID` | Backend Google Client ID | `abc123.apps.googleusercontent.com` |
| `VITE_API_URL` | Backend API URL | `http://localhost:4000` |
| `JWT_SECRET` | JWT signing secret | `watch-shop-secret-key-2025` |
| `PORT` | Backend server port | `4000` |

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid Client ID" | Wrong or missing Client ID | Run `npm run setup:google` |
| CORS Error | Backend not configured | Check auth-server.js has `cors()` |
| Token verification failed | Token expired or invalid | Request fresh token from Google |
| User not created | Permissions issue | Check users.json exists and is writable |
| Port 5173 in use | Another app using port | Vite auto-switches to 5174 |

---

## ✨ Features

- ✅ Google OAuth 2.0 integration
- ✅ Automatic user creation from Google profile
- ✅ JWT token generation
- ✅ Profile picture storage
- ✅ Email uniqueness enforcement
- ✅ Fallback to localStorage if API unavailable
- ✅ Session-based token storage
- ✅ Profile persistence

---

## 🎯 Next Steps (Optional)

1. Add password hashing for traditional users
2. Add refresh token mechanism
3. Add email verification
4. Add user profile update endpoint
5. Add logout/revoke endpoint
6. Add role-based access control (RBAC)
7. Add database persistence (MongoDB, PostgreSQL)
8. Add rate limiting on auth endpoints

---

## 📞 Support

For detailed setup instructions, see:
- `GOOGLE_OAUTH_SETUP.md` - Complete guide
- `GOOGLE_OAUTH_QUICKSTART.md` - Quick start
- `configure-google-oauth.js` - Interactive setup

Happy coding! 🚀
