# 🚀 Google OAuth Deployment Guide

## Production Deployment

### Environment Setup

#### 1. Update .env for Production

```env
# Production API
VITE_API_URL=https://your-api-domain.com
VITE_GOOGLE_CLIENT_ID=YOUR_PROD_CLIENT_ID.apps.googleusercontent.com

# Backend
GOOGLE_CLIENT_ID=YOUR_PROD_CLIENT_ID.apps.googleusercontent.com
JWT_SECRET=production-random-secret-key-min-32-chars
NODE_ENV=production
PORT=3000
```

#### 2. Google Cloud Console Configuration

1. Create **new OAuth credentials** for production (or update existing)
2. Go to [Google Cloud Console](https://console.cloud.google.com/)
3. Navigate to **Credentials** → Select your OAuth 2.0 Client
4. Update **Authorized redirect URIs:**
   - `https://yoursite.com`
   - `https://www.yoursite.com`
   - `https://yoursite.com/login`
   - (Remove localhost URIs)
5. **Save**

⚠️ **Important:** Use same Client ID for both dev and prod, or create separate credentials.

---

## Deployment Platforms

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Google OAuth"
   git push origin main
   ```

2. **Deploy Frontend**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your repository
   - Framework: "Vite"
   - Environment Variables:
     ```
     VITE_API_URL=https://your-backend.railway.app
     VITE_GOOGLE_CLIENT_ID=prod-client-id.apps.googleusercontent.com
     ```
   - Deploy

3. **Update Google OAuth**
   - Add Vercel domain to Google Cloud Console redirect URIs
   - Format: `https://your-project.vercel.app`

#### Backend (Railway)

1. **Deploy Backend**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Railway automatically detects Node.js
   - Set environment variables:
     ```
     GOOGLE_CLIENT_ID=prod-client-id.apps.googleusercontent.com
     JWT_SECRET=very-secure-random-key
     NODE_ENV=production
     PORT=3000
     ```
   - Deploy

2. **Get Backend URL**
   - Railway provides domain: `https://your-backend.railway.app`
   - Update Vercel's `VITE_API_URL`

### Option 2: Heroku (Both)

#### Backend

```bash
heroku login
heroku create your-app-backend
heroku config:set \
  GOOGLE_CLIENT_ID="YOUR_CLIENT_ID" \
  JWT_SECRET="your-secret-key" \
  NODE_ENV=production
git push heroku main
```

#### Frontend

```bash
heroku create your-app-frontend
heroku config:set \
  VITE_API_URL="https://your-app-backend.herokuapp.com" \
  VITE_GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
npm run build
# Deploy build folder
```

### Option 3: AWS (EC2 + S3)

#### Backend (EC2)

1. **Create EC2 Instance**
   - Ubuntu 20.04 LTS
   - t2.micro (free tier)
   - Security group: Open port 3000

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance.ec2.amazonaws.com
   
   # Install Node.js
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs git
   
   # Clone and setup
   git clone your-repo.git
   cd projectend
   npm install
   
   # Set environment variables
   export GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
   export JWT_SECRET="your-secret-key"
   
   # Run with PM2
   npm install -g pm2
   pm2 start "npm run server" --name auth-server
   pm2 save
   ```

3. **Get Public IP**
   - Use EC2 public IP for API URL

#### Frontend (S3 + CloudFront)

```bash
# Build
npm run build

# Create S3 bucket
aws s3 mb s3://your-app-name --region us-east-1

# Upload build
aws s3 sync dist/ s3://your-app-name --delete

# Create CloudFront distribution pointing to S3
# Update VITE_API_URL to EC2 public IP
```

---

## Database Migration (Optional)

Currently uses JSON file (`users.json`). For production, consider:

### MongoDB

```bash
npm install mongoose
```

```javascript
// Example
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: String,
  fullName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  avatar: String,
  role: String,
  googleId: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
```

### PostgreSQL

```bash
npm install pg
```

```javascript
const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  database: 'watch_store'
});
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Add to Node.js
const fs = require('fs');
const https = require('https');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
};

https.createServer(options, app).listen(3000);
```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
# Install PM2 Plus
pm2 install pm2-logrotate
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs auth-server
```

### Error Tracking (Sentry)

```bash
npm install @sentry/node
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## Security Checklist

- [ ] Google Client ID kept in environment variables
- [ ] JWT secret is random (32+ chars)
- [ ] HTTPS enabled on all endpoints
- [ ] CORS properly configured (not `*`)
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak info
- [ ] Database backups enabled
- [ ] Monitoring/logging enabled
- [ ] Dependencies kept up to date

---

## Performance Optimization

### Frontend

1. **Code Splitting**
   ```javascript
   // vite.config.ts
   rollupOptions: {
     output: {
       manualChunks: {
         'google-auth': ['@react-oauth/google'],
         'vendor': ['react', 'react-dom']
       }
     }
   }
   ```

2. **Image Optimization**
   - Compress profile pictures
   - Use WebP format

3. **Caching**
   - Cache user profile for 1 hour
   - Cache API responses

### Backend

1. **Connection Pooling**
   - Use database connection pool

2. **Caching**
   - Cache Google Client for 1 hour
   - Redis for session storage

3. **Load Balancing**
   - Use multiple instances
   - Load balancer in front

---

## Troubleshooting Production Issues

### CORS Errors
```javascript
// Update CORS config
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

### Token Verification Fails
- Check Client ID matches Google Console
- Verify redirect URI is in Google Console
- Check token isn't expired

### User Creation Fails
- Verify database write permissions
- Check disk space
- Check database connection

### High Latency
- Enable caching
- Use CDN for frontend
- Optimize database queries
- Check network connectivity to Google

---

## Rollback Plan

```bash
# If something goes wrong:

# Check logs
pm2 logs auth-server

# Revert code
git revert HEAD

# Redeploy
git push heroku main
# or
npm run build && aws s3 sync dist/ s3://bucket --delete
```

---

## Cost Estimation

| Service | Free Tier | Cost (Approx) |
|---------|-----------|---------------|
| Vercel Frontend | ✅ Yes | Free |
| Railway Backend | ✅ Yes | $5/month |
| Google OAuth | ✅ Yes | Free (up to 1M requests) |
| MongoDB Atlas | ✅ Yes (512MB) | $9/month |
| Domain | ❌ | $10-15/year |
| **Total** | | **~$200/year** |

---

## Maintenance

### Weekly
- [ ] Check error logs
- [ ] Monitor response times

### Monthly
- [ ] Update dependencies
  ```bash
  npm outdated
  npm update
  ```
- [ ] Review user data growth
- [ ] Check SSL certificate expiry

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Database backup verification

---

## Support Resources

- [Google OAuth Troubleshooting](https://developers.google.com/identity/protocols/oauth2/troubleshooting)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Railway Docs](https://railway.app/docs)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

## Questions?

Check `GOOGLE_OAUTH_SETUP.md` or `IMPLEMENTATION_SUMMARY.md` for more details.

Good luck with your deployment! 🚀
