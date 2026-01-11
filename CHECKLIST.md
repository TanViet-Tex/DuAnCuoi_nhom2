# ✅ Google OAuth 2.0 Implementation Checklist

## ✨ What's Already Done

### Backend
- ✅ Installed `google-auth-library` package
- ✅ Created `POST /api/auth/google` endpoint
- ✅ Implemented Google idToken verification
- ✅ Auto-user creation logic
- ✅ JWT token generation for Google users
- ✅ CORS already enabled

### Frontend
- ✅ Installed `@react-oauth/google` package
- ✅ Updated `AuthContext.tsx` with `loginWithGoogle()` method
- ✅ Updated `Login.tsx` with Google Login button
- ✅ Environment variable support

### Configuration
- ✅ Created `.env` template file
- ✅ Created `vite.config.ts` with port configuration
- ✅ Created helper scripts for easy setup

---

## 🚀 What You Need To Do

### Step 1: Get Google Client ID (5 minutes)

- [ ] Go to https://console.cloud.google.com/
- [ ] Create a new project (or use existing)
- [ ] Search for "Google+ API" and enable it
- [ ] Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
- [ ] Choose **Web application**
- [ ] Set Application name: "Watch Store Web"
- [ ] Add **Authorized redirect URIs:**
  - [ ] `http://localhost:5173`
  - [ ] `http://localhost:5174`
  - [ ] `http://localhost:3000`
  - [ ] (Your production domain later)
- [ ] Click Create
- [ ] **Copy the Client ID** (format: `xxxxx.apps.googleusercontent.com`)

### Step 2: Configure Locally (2 minutes)

**Option A - Automatic Setup:**
```bash
npm run setup:google
# Paste your Client ID when prompted
```

**Option B - Manual Setup:**
Edit `.env` file and update:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

### Step 3: Start Development Servers (1 minute)

**Option A - Start Both Together:**
```bash
npm start
```

**Option B - Start Separately:**
```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev
```

Expected output:
```
✅ Auth Server đang chạy tại http://localhost:4000
🔓 Google OAuth: POST http://localhost:4000/api/auth/google

ROLLDOWN-VITE v7.2.5  ready
➜  Local:   http://localhost:5174/
```

### Step 4: Test Google Login (3 minutes)

1. [ ] Open http://localhost:5173 or http://localhost:5174
2. [ ] Click **Login** in navbar
3. [ ] Click **"Sign in with Google"** button
4. [ ] Select your Google account
5. [ ] Allow permissions when asked
6. [ ] Should redirect to home page with logged-in status
7. [ ] Check that username appears in navbar
8. [ ] Check browser console for any errors

---

## 📋 Verification Checklist

After setup, verify these things work:

### Frontend
- [ ] Login page loads without errors
- [ ] Google Sign-in button appears
- [ ] Can click button and open Google popup
- [ ] After login, redirected to home page
- [ ] User profile appears in navbar/menu

### Backend
- [ ] Auth server runs on port 4000
- [ ] All endpoints show in console logs
- [ ] Google endpoint is listed
- [ ] No errors in server console

### Integration
- [ ] Browser console has no errors
- [ ] Users.json file is created
- [ ] New user is saved after Google login
- [ ] Can log out and log back in with same Google account

---

## 📊 Success Indicators

✅ You've successfully set up Google OAuth if:

1. User can click "Sign in with Google" button
2. Google login popup opens
3. After signing in, user is redirected to home page
4. User profile is displayed (name, email)
5. A new user entry is created in `server/data/users.json`
6. Backend logs show token verification success
7. Frontend shows user is logged in
8. User can logout and log back in

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid Client ID" | Check you copied the correct ID from Google Console |
| Button doesn't appear | Check VITE_GOOGLE_CLIENT_ID in `.env` |
| CORS Error | Make sure backend is running on port 4000 |
| Token verification fails | Check GOOGLE_CLIENT_ID on backend matches |
| Port already in use | Kill the process or let Vite use next port (5174) |
| "user is null" | Check redirect URIs added to Google Console |

For more help, see:
- `GOOGLE_OAUTH_SETUP.md` - Detailed setup guide
- `GOOGLE_OAUTH_QUICKSTART.md` - Quick reference
- `IMPLEMENTATION_SUMMARY.md` - Technical details

---

## 📁 Key Files

- `.env` - Your configuration (with Client ID)
- `server/auth-server.js` - Backend with Google endpoint
- `src/contexts/AuthContext.tsx` - Login logic
- `src/pages/Login.tsx` - Login UI with Google button

---

## ⏱️ Estimated Time

- Get Client ID: **5 minutes**
- Configure: **2 minutes**
- Start servers: **1 minute**
- Test: **3 minutes**

**Total: ~15 minutes to have Google OAuth working! ⚡**

---

## 🎉 You're Done!

Once you've completed all steps above, your app has:
- ✅ Google OAuth 2.0 integration
- ✅ Auto user creation from Google profile
- ✅ Secure JWT token generation
- ✅ Profile picture storage
- ✅ Email-based user uniqueness

Happy coding! 🚀
