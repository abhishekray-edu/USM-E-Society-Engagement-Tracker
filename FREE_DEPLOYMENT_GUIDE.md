# 🆓 Free Deployment Guide

This guide will help you deploy your Student Points Tracker app **completely free** using:
- **Vercel** (Frontend) - Free forever
- **Railway** or **Render** (Backend + Database) - Free tier available

---

## 📋 Prerequisites

1. GitHub account
2. Your code pushed to a GitHub repository
3. Vercel account (sign up at [vercel.com](https://vercel.com))
4. Railway account (sign up at [railway.app](https://railway.app)) OR Render account (sign up at [render.com](https://render.com))

---

## 🎯 Quick Start (Recommended Path)

### Option A: Vercel + Railway (Easier, More Generous Free Tier)

**Total Cost: $0/month** (Railway gives you $5/month free credit)

### Option B: Vercel + Render (100% Free)

**Total Cost: $0/month** (Render has a free tier with limitations)

---

## 🚀 Step-by-Step Deployment

## Part 1: Deploy Backend (Choose One)

### Option A: Railway (Recommended)

1. **Go to [railway.app](https://railway.app)** and sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `btb` repository
   - Railway will auto-detect Node.js

3. **Configure the Service**
   - Click on your service
   - Go to "Settings" tab
   - Set **Start Command**: `node server/production.js`
   - Under "Environment", add:
     - `PORT` = `3001` (Railway will override this, but keep it)

4. **Set Up Admin Credentials**
   
   Railway doesn't have an easy way to run interactive scripts, so we'll set credentials via environment variables:
   
   - Go to "Variables" tab
   - Click "RAW Editor"
   - Add these (change the values!):
   ```
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD_HASH=$2a$10$YourHashedPasswordHere
   ```
   
   **To generate a password hash**, run this locally:
   ```bash
   npm install
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123', 10).then(console.log)"
   ```
   Copy the output and paste it as `ADMIN_PASSWORD_HASH`

5. **Deploy**
   - Railway auto-deploys on push
   - Click "Deployments" to see progress
   - Once deployed, copy your app URL (e.g., `https://btb-production.up.railway.app`)

6. **Generate Domain** (Optional but recommended)
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - You'll get a free Railway domain like `btb-production.up.railway.app`

---

### Option B: Render (100% Free)

1. **Go to [render.com](https://render.com)** and sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `btb` repository

3. **Configure the Service**
   - **Name**: `btb-tracker`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/production.js`
   - **Plan**: Free

4. **Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add `PORT` = `10000` (Render's default)

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for first deployment
   - Copy your app URL (e.g., `https://btb-tracker.onrender.com`)

6. **Set Admin Password**
   
   After first deployment, you'll need to set your admin password. Since Render doesn't allow shell access on free tier:
   
   - Create a temporary endpoint in your backend to set credentials (add this to `server/production.js`):
   
   ```javascript
   // TEMPORARY - Remove after setup!
   app.post('/api/setup-admin', async (req, res) => {
     const { username, password, setupKey } = req.body;
     
     if (setupKey !== 'your-secret-setup-key-12345') {
       return res.status(403).json({ error: 'Invalid setup key' });
     }
     
     const hashedPassword = await hashPassword(password);
     db.prepare('DELETE FROM settings WHERE key IN (?, ?)').run('admin_username', 'admin_password');
     const insertStmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
     insertStmt.run('admin_username', username);
     insertStmt.run('admin_password', hashedPassword);
     
     res.json({ success: true });
   });
   ```
   
   - Deploy this change
   - Call the endpoint once with curl or Postman:
   ```bash
   curl -X POST https://btb-tracker.onrender.com/api/setup-admin \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"YourSecurePassword123","setupKey":"your-secret-setup-key-12345"}'
   ```
   
   - Remove the endpoint and redeploy for security

**⚠️ Important for Render Free Tier:**
- Free services spin down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds to wake up
- Database persists, but expect slower performance

---

## Part 2: Deploy Frontend (Vercel)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your `btb` repository
   - Vercel auto-detects Vite

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**
   - Click "Environment Variables"
   - Add `VITE_API_URL` = Your backend URL from Railway/Render
     - Railway example: `https://btb-production.up.railway.app/api`
     - Render example: `https://btb-tracker.onrender.com/api`

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - You'll get a URL like `https://btb-tracker.vercel.app`

6. **Custom Domain** (Optional)
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain for free!

---

## 🔐 Securing Your App (Important!)

### After Deployment, Change Your Password Immediately!

1. Visit your deployed app URL
2. Click "Admin Login"
3. Login with default credentials (username: `admin`, password: `admin123`)
4. Click "Change Password" button in admin panel
5. Set a strong password (at least 12 characters)

### Or Set It Up Initially (Better Approach)

**If you deployed to Railway with environment variables:**
- You already set secure credentials via `ADMIN_PASSWORD_HASH`

**If you deployed to Render:**
- Use the temporary setup endpoint method described above
- Or modify `server/production.js` to read from environment variables:

```javascript
// Add this to server/production.js after database initialization
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// On first run, set up credentials from environment
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
if (settingsCount === 0 && process.env.ADMIN_PASSWORD) {
  const hashedPassword = await hashPassword(ADMIN_PASSWORD);
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('admin_username', ADMIN_USERNAME);
  insertSetting.run('admin_password', hashedPassword);
}
```

Then set environment variables in Render:
- `ADMIN_USERNAME=yourusername`
- `ADMIN_PASSWORD=YourSecurePassword123`

---

## 🎨 Your Free Setup

After deployment, you'll have:

✅ **Frontend URL**: `https://btb-tracker.vercel.app` (or your custom domain)  
✅ **Backend URL**: `https://your-app.railway.app` or `https://your-app.onrender.com`  
✅ **Database**: SQLite file stored on Railway/Render  
✅ **Auto-deployments**: Pushes to GitHub automatically redeploy  
✅ **HTTPS**: Automatic SSL certificates  
✅ **Free domain**: Provided by Vercel/Railway/Render  

---

## 📊 Free Tier Limits

### Vercel (Frontend)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Zero downtime

### Railway (Backend)
- ✅ $5/month in free credits (~500 hours)
- ✅ 1 GB RAM
- ✅ 1 GB disk
- ⚠️ Sleeps after inactivity (on free tier)
- ✅ Good for small clubs (< 100 active users)

### Render (Backend)
- ✅ 750 hours/month free (enough for 24/7)
- ✅ 512 MB RAM
- ✅ Automatic HTTPS
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 50-60s cold start time
- ✅ Free PostgreSQL (if you want to upgrade from SQLite)

---

## 🔄 Updating Your App

### Automatic Updates
Both Vercel and Railway/Render automatically redeploy when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

That's it! Both frontend and backend will redeploy automatically.

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel environment variables
- Make sure your backend URL includes `/api`
- Check CORS settings in `server/production.js`

### Backend isn't responding
- **Railway**: Check deployment logs
- **Render**: Service might be sleeping, wait 60 seconds
- Check if database file exists

### "Invalid credentials" after deployment
- You need to set up admin password (see security section above)
- Check if database was initialized properly

### Database keeps resetting
- Check if `database.db` is in `.gitignore` (it should be)
- On Render: Database persists in `/opt/render/project/src/server/`
- On Railway: Database persists in `/app/server/`

---

## 💾 Database Backups

### Railway
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Download database:
   ```bash
   railway run bash -c "cat server/database.db" > backup.db
   ```

### Render
Use the temporary endpoint method to create a backup endpoint:

```javascript
app.get('/api/backup', (req, res) => {
  const backupKey = process.env.BACKUP_KEY;
  if (req.query.key !== backupKey) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  res.download('server/database.db', 'backup.db');
});
```

Then download via browser: `https://your-app.onrender.com/api/backup?key=your-secret-key`

---

## 🚀 Next Steps

1. ✅ Deploy backend to Railway/Render
2. ✅ Deploy frontend to Vercel
3. ✅ Set secure admin password
4. ✅ Test the app end-to-end
5. ✅ Share the URL with your club!
6. 🔄 Set up regular database backups (weekly recommended)

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| **Vercel** (Frontend) | Free forever | $20/month (Pro) |
| **Railway** (Backend) | $5/month credit | $5-20/month |
| **Render** (Backend) | Free (with limits) | $7/month (Starter) |

**Recommended for most clubs**: Vercel + Railway = **$0/month** (Railway's $5 credit covers it)

**Recommended for budget-conscious**: Vercel + Render = **$0/month** (tolerate 60s cold starts)

---

## 🎓 For Educational Use

Both Railway and Render offer education credits:
- **Railway**: Apply for GitHub Student Developer Pack (extra credits)
- **Render**: Contact support for education plan

---

## ❓ Need Help?

- Check deployment logs in Vercel/Railway/Render dashboard
- Test backend API directly: `https://your-backend.com/api/health`
- Verify environment variables are set correctly
- Make sure CORS is configured in backend

Good luck with your deployment! 🚀

