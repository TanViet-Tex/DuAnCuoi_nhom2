# 👜 Watch Store - E-Commerce Platform

A modern e-commerce platform for watches with React, Vite, and **Google OAuth 2.0 authentication**.

## ✨ Features

- 🛒 Modern e-commerce interface
- 🔐 **Google OAuth 2.0 Authentication** (NEW!)
- 📱 Responsive design
- 🎨 Tailwind CSS styling
- ⚡ Vite + React + TypeScript
- 🔄 React Router navigation
- 🛠️ Express.js backend
- 💾 JSON-based user storage

---

## 🚀 Quick Start (15 minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### 1. Get Google Client ID
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add Authorized URIs: `http://localhost:5173`, `http://localhost:5174`
6. Copy your Client ID

### 2. Configure
```bash
npm run setup:google
# Paste your Google Client ID when prompted
```

### 3. Start Both Servers
```bash
npm start
```

Or start separately:
```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev
```

### 4. Test
1. Go to http://localhost:5174/login (or http://localhost:5173)
2. Click "Sign in with Google"
3. Sign in with your Google account
4. Enjoy! 🎉

---

## 📚 Documentation

Start here based on your needs:

| Document | Time | Purpose |
|----------|------|---------|
| **[CHECKLIST.md](CHECKLIST.md)** | 5 min | ⭐ Step-by-step setup guide |
| **[DOCS_INDEX.md](DOCS_INDEX.md)** | 2 min | Complete documentation index |
| **[README_GOOGLE_OAUTH.md](README_GOOGLE_OAUTH.md)** | 10 min | Google OAuth overview |
| **[GOOGLE_OAUTH_QUICKSTART.md](GOOGLE_OAUTH_QUICKSTART.md)** | 5 min | Quick reference |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | 30 min | Production deployment |

---

## 🎯 Available Scripts

```bash
# Development
npm run dev              # Start frontend (Vite)
npm run server          # Start backend (Auth server)
npm start               # Start both servers

# Setup
npm run setup:google    # Interactive Google OAuth setup

# Build
npm run build           # Build for production
npm run preview         # Preview production build

# Utilities
npm run server:dev      # Start backend with hot reload (requires nodemon)
```

---

## 🏗️ Project Structure

```
projectend/
├── src/                       # Frontend React app
│   ├── pages/                # Page components
│   │   ├── Login.tsx        # 🔐 Google OAuth login
│   │   ├── Register.tsx
│   │   ├── Cart.tsx
│   │   └── ...
│   ├── components/          # Reusable components
│   ├── contexts/
│   │   └── AuthContext.tsx  # 🔐 Auth logic with Google
│   ├── routes/              # React Router routes
│   └── main.tsx
├── server/                    # Backend Express app
│   ├── auth-server.js       # 🔐 Auth endpoints + Google OAuth
│   └── data/
│       └── users.json       # User storage
├── .env                       # 🔐 Configuration (add your Google Client ID)
├── vite.config.ts           # Frontend build config
├── package.json
└── README.md                # This file
```

---

## 🔐 Google OAuth 2.0 Features

### What Works
- ✅ Sign in with Google (one-click)
- ✅ Automatic user account creation
- ✅ Profile picture from Google
- ✅ Secure JWT token generation
- ✅ Traditional email/password login still available
- ✅ User profile persistence

### How It Works
1. **Frontend:** User clicks "Sign in with Google"
2. **Google:** Opens OAuth popup for authentication
3. **Backend:** Verifies token and creates/finds user
4. **Response:** Returns JWT token and user profile
5. **Storage:** Token stored in sessionStorage, profile in localStorage

---

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register
  ├─ Email/password registration
  └─ Returns: { user, token }

POST /api/auth/login
  ├─ Email/password login
  └─ Returns: { user, token }

POST /api/auth/google
  ├─ Google OAuth login (NEW!)
  ├─ Verifies idToken from Google
  ├─ Auto-creates user if needed
  └─ Returns: { user, token }

GET /api/users
  ├─ Get all users (admin)
  └─ Returns: [ {...user}, ... ]

GET /api/health
  ├─ Health check
  └─ Returns: { status }
```

---

## 🗄️ Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **@react-oauth/google** - Google OAuth
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **google-auth-library** - Token verification
- **jsonwebtoken** - JWT generation
- **CORS** - Cross-origin requests

---

## 📊 User Storage

### Google Users (Auto-Created)
```json
{
  "id": "u_google_123",
  "fullName": "John Doe",
  "email": "john@gmail.com",
  "avatar": "https://lh3.googleusercontent.com/...",
  "role": "user",
  "googleId": "123456789"
}
```

### Traditional Users
```json
{
  "id": "u_456",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "0987654321",
  "password": "hashed_password",
  "role": "user"
}
```

---

## 🔒 Security

- ✅ Google token verification
- ✅ JWT authentication
- ✅ CORS enabled
- ✅ Secure session storage
- ✅ Environment variable configuration
- ✅ Email uniqueness validation

---

## 🚀 Deployment

Ready for production? See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- Vercel + Railway
- Heroku
- AWS EC2 + S3
- Database migration
- SSL/HTTPS setup

---

## 🆘 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| "Invalid Client ID" | Check GOOGLE_CLIENT_ID in .env matches Google Console |
| Port already in use | Kill process or let app use next port (5174) |
| CORS Error | Ensure backend is running on port 4000 |
| User not created | Check users.json file exists and is writable |
| Google button not showing | Verify VITE_GOOGLE_CLIENT_ID in .env |

For more help, see [GOOGLE_OAUTH_QUICKSTART.md](GOOGLE_OAUTH_QUICKSTART.md)

---

## 📖 Learning Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Express.js Guide](https://expressjs.com/)
- [JWT Introduction](https://jwt.io/)

---

## 🎓 Setup Documentation

This project includes comprehensive guides for every aspect:

- **New to Google OAuth?** → Read [CHECKLIST.md](CHECKLIST.md)
- **Need quick reference?** → Read [GOOGLE_OAUTH_QUICKSTART.md](GOOGLE_OAUTH_QUICKSTART.md)
- **Want deep dive?** → Read [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)
- **Deploying?** → Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Finding something?** → Read [DOCS_INDEX.md](DOCS_INDEX.md)

---

## 💡 Pro Tips

1. Use `npm run setup:google` for interactive setup
2. Use `npm start` to run both servers at once
3. Keep `.env` file with your Google Client ID
4. Check browser console for any errors
5. Review backend logs in terminal for issues

---

## 📝 License

This project is open source and available for learning and development.

---

## 🎉 Ready to Get Started?

1. **[Read CHECKLIST.md](CHECKLIST.md)** - 5 minute guide
2. **Get your Google Client ID**
3. **Run `npm run setup:google`**
4. **Run `npm start`**
5. **Login with Google** at http://localhost:5173/login

Happy coding! 🚀
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
