# 🔐 Google OAuth 2.0 Setup Guide

## Overview
Hệ thống này sử dụng Google OAuth 2.0 để cho phép người dùng đăng nhập bằng tài khoản Google (Gmail).

## Flow Architecture

```
Frontend (React)
    ↓
1. User clicks "Sign in with Google"
    ↓
2. @react-oauth/google → Google Auth Server
    ↓
3. Google returns idToken (JWT)
    ↓
4. Frontend sends idToken → Backend
    ↓
Backend (Node.js/Express)
    ↓
5. Verify idToken with google-auth-library
    ↓
6. Extract email & profile info from Google
    ↓
7. Check if user exists in database
    ↓
8. If not exist → Create new user
    ↓
9. Generate JWT token (7 days expiry)
    ↓
10. Return user + JWT token → Frontend
    ↓
Frontend
    ↓
11. Store token in sessionStorage
    ↓
12. Redirect to home page
```

## Setup Steps

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Type: Web application
   - Name: "Watch Store Web"
5. Add Authorized redirect URIs:
   - `http://localhost:5173` (Vite default)
   - `http://localhost:3000` (alternative)
   - Your production domain (e.g., `https://yoursite.com`)
6. Copy the **Client ID** (format: `xxxxx.apps.googleusercontent.com`)

### Step 2: Configure Environment Variables

**Frontend (.env or .env.local):**
```
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

**Backend (.env):**
```
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
JWT_SECRET=your-secret-key
PORT=4000
```

### Step 3: Install Dependencies

Backend:
```bash
npm install google-auth-library jsonwebtoken
```

Frontend:
```bash
npm install @react-oauth/google
```

### Step 4: Backend Implementation

**Endpoint:** `POST /api/auth/google`

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
}
```

**Response (Success):**
```json
{
  "message": "Google login successful",
  "user": {
    "id": "u_google_1234567890",
    "fullName": "John Doe",
    "email": "john@gmail.com",
    "phone": "",
    "avatar": "https://...",
    "role": "user",
    "googleId": "1234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error):**
```json
{
  "message": "Invalid or expired idToken",
  "error": "Error details"
}
```

### Step 5: Frontend Implementation

**GoogleLoginButton Component:**
```tsx
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { loginWithGoogle } = useAuth();
  
  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    const success = await loginWithGoogle(idToken);
    if (success) {
      navigate('/');
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log('Login Failed')}
      />
    </GoogleOAuthProvider>
  );
}
```

## API Endpoints

### 1. Google OAuth Login
- **Endpoint:** `POST /api/auth/google`
- **Body:** `{ idToken: string }`
- **Response:** `{ user, token }`
- **Description:** Verify Google idToken, create user if not exists, return JWT

### 2. Traditional Login
- **Endpoint:** `POST /api/auth/login`
- **Body:** `{ email, password }`
- **Response:** `{ user, token }`

### 3. Traditional Register
- **Endpoint:** `POST /api/auth/register`
- **Body:** `{ fullName, email, phone, password }`
- **Response:** `{ user, token }`

### 4. Get All Users
- **Endpoint:** `GET /api/users`
- **Response:** Array of users (without passwords)

## User Database Structure

```json
{
  "id": "u_google_1234567890",
  "fullName": "John Doe",
  "email": "john@gmail.com",
  "phone": "",
  "password": "",
  "avatar": "https://lh3.googleusercontent.com/...",
  "role": "user",
  "googleId": "1234567890"
}
```

### Key Differences:
- Google users: `password` is empty, `googleId` is set, `avatar` from Google
- Traditional users: `password` is set, `googleId` is undefined, `avatar` is empty

## Security Considerations

1. **Token Verification:** Backend verifies idToken directly with Google's API
2. **No Password Storage:** Google users don't have passwords
3. **JWT Expiry:** Frontend tokens expire after 7 days
4. **HTTPS Only:** In production, always use HTTPS
5. **Environment Variables:** Never commit real Client IDs to Git

## Testing

### 1. Test with Development Server

```bash
# Terminal 1 - Backend
cd projectend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### 2. Test Google Login Flow

1. Navigate to http://localhost:5173/login
2. Click "Sign in with Google"
3. Select a Google account
4. Check backend logs for token verification
5. Should redirect to home page with logged-in status

### 3. Test with cURL (Backend)

```bash
# Get a valid idToken first from Google, then:
curl -X POST http://localhost:4000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_GOOGLE_ID_TOKEN"
  }'
```

## Troubleshooting

### Issue: "Invalid Client ID"
- ✅ Check GOOGLE_CLIENT_ID matches Google Console
- ✅ Ensure Client ID is for "Web application"
- ✅ Verify redirect URIs include your current domain

### Issue: "CORS Error"
- ✅ Backend has `cors()` middleware enabled
- ✅ Frontend uses correct API_URL from env

### Issue: "Invalid idToken"
- ✅ Token might be expired (Google tokens valid for ~1 hour)
- ✅ Verify Backend can reach Google's verification endpoint
- ✅ Check GOOGLE_CLIENT_ID is accessible by Backend

### Issue: "User created but login fails"
- ✅ Check users.json file exists and is readable
- ✅ Verify email field matches Google's email
- ✅ Check JWT secret is same on backend

## Production Deployment

### Environment Setup:
```env
# Production
VITE_API_URL=https://api.yoursite.com
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com

# Backend
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
JWT_SECRET=very-secure-random-key
NODE_ENV=production
```

### Google Console Setup:
1. Add your production domain to Authorized redirect URIs
2. Use same Client ID for both dev and production
3. Consider using separate credentials for each environment

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- [google-auth-library](https://www.npmjs.com/package/google-auth-library)
- [JWT.io - JWT Explanation](https://jwt.io/)
