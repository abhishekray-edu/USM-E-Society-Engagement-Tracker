# 🚀 Quick Start Guide

Get your Student Points Tracker up and running in minutes!

---

## 🎯 What You're Building

A full-stack points tracking system with:
- ✅ React frontend (Vercel - Free)
- ✅ Node.js backend (Railway/Render - Free)
- ✅ SQLite database (persistent storage)
- ✅ Secure password authentication
- ✅ Free domain included!

---

## 📦 Installation

```bash
# Install dependencies
npm install
```

---

## 🔧 Local Development

### Option 1: Quick Test (Development Mode)

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Visit: `http://localhost:5173`

**Default Login:**
- Username: `admin`
- Password: `admin123`

### Option 2: Set Custom Admin Password (Recommended)

```bash
# Run the setup wizard
npm run setup

# Follow prompts to create your admin credentials
```

Then start both servers as shown above.

---

## 🌐 Deploy to Production (100% FREE)

### 🎬 Video Tutorial Path

**Total Time: 15 minutes**

### Step 1: Push to GitHub (5 min)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/btb.git
git push -u origin main
```

### Step 2: Deploy Backend to Railway (5 min)

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `btb` repository
5. Settings → Change start command to: `node server/production.js`
6. **Optional but recommended:** Go to Variables, add:
   - `ADMIN_USERNAME` = `your_username`
   - `ADMIN_PASSWORD` = `YourSecurePassword123`
7. Copy your Railway URL (e.g., `btb-production-xxx.up.railway.app`)

### Step 3: Deploy Frontend to Vercel (5 min)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project" → Import your `btb` repo
4. **Important:** Add Environment Variable:
   - `VITE_API_URL` = `https://your-railway-url.railway.app/api`
5. Click "Deploy"
6. Done! You get a URL like `btb-tracker.vercel.app`

### Step 4: Secure Your App (2 min)

1. Visit your Vercel URL
2. Click "Admin Login"
3. Login with default credentials (or your custom ones from Step 2)
4. Click "Change Password" button
5. Set a strong password

**🎉 You're live!**

---

## 📖 Detailed Deployment Guide

For step-by-step instructions with screenshots and troubleshooting:

👉 **See [FREE_DEPLOYMENT_GUIDE.md](./FREE_DEPLOYMENT_GUIDE.md)**

---

## 🔐 Security Checklist

Before sharing your app:

- [ ] Changed default admin password
- [ ] Removed demo credentials from login modal (optional)
- [ ] Set up environment variables in Railway
- [ ] Tested login/logout flow
- [ ] Tested adding students and points
- [ ] Created a database backup

---

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start frontend dev server
npm run server       # Start backend server
npm run setup        # Run setup wizard for admin credentials

# Production
npm run build        # Build frontend for production
npm start            # Start production server
```

---

## 📊 What's Free?

### Vercel (Frontend)
- ✅ Unlimited bandwidth (100GB/month)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domains
- ✅ Auto-deployments from GitHub

### Railway (Backend) 
- ✅ $5/month free credit (~500 hours)
- ✅ 1GB RAM, 1GB disk
- ✅ Automatic HTTPS
- ✅ Free .railway.app domain
- ⚠️ May sleep after inactivity on free tier

**Alternative: Render (Backend)**
- ✅ 750 hours/month free
- ✅ Automatic HTTPS
- ⚠️ Spins down after 15 min (60s cold start)

---

## 🔄 Making Updates

After deployment, updates are automatic:

```bash
# Make your changes
git add .
git commit -m "Added new feature"
git push

# Both Vercel and Railway will auto-deploy! 🚀
```

---

## 💾 Backup Your Database

### Manual Backup

**If deployed to Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Download database
railway run cat server/database.db > backup-$(date +%Y%m%d).db
```

**If deployed to Render:**
- Access via their web terminal
- Or create a backup endpoint (see FREE_DEPLOYMENT_GUIDE.md)

### Recommended Schedule
- Weekly backups for active clubs
- Before any major updates
- Before July 1st (year reset)

---

## 🐛 Troubleshooting

### "Failed to load student data"
- Check if backend is running
- Verify `VITE_API_URL` in Vercel settings
- Check browser console for errors

### "Invalid credentials"
- Make sure you changed password after deployment
- Check if database was initialized
- Try default credentials if just deployed

### Frontend can't connect to backend
- Check CORS settings in `server/production.js`
- Verify backend URL has `/api` at the end
- Test backend directly: `https://your-backend.com/api/health`

### Railway/Render app sleeping
- **Railway**: Free tier may sleep after inactivity
- **Render**: Definitely sleeps after 15 min (free tier)
- First request takes 30-60 seconds to wake up
- Consider paid tier ($5-7/month) for 24/7 uptime

---

## 📚 Documentation

- [README.md](./README.md) - Full documentation
- [FREE_DEPLOYMENT_GUIDE.md](./FREE_DEPLOYMENT_GUIDE.md) - Detailed deployment steps
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Advanced deployment options

---

## 🎓 For Your Club

### Sharing Access

**Public Leaderboard:**
- Share your Vercel URL with students
- They can view standings without login
- Only admins can add/remove points

**Admin Access:**
- Keep admin credentials secure
- Change password regularly
- Consider multiple admin accounts (future feature)

### Best Practices

1. **Announce the System**
   - Share the public URL at meetings
   - Explain the tier system and rewards
   - Post on your club's Discord/Slack

2. **Weekly Updates**
   - Update points after each event
   - Export CSV to share standings
   - Celebrate students reaching new tiers

3. **End of Year**
   - Export final CSV before July 1st
   - Use "Reset Year" button for new academic year
   - Archive previous year's data

---

## 💡 Next Steps

**Immediate:**
1. ✅ Deploy to Vercel + Railway
2. ✅ Change admin password
3. ✅ Add your first students
4. ✅ Test adding points

**This Week:**
1. 🎨 Customize point values if needed
2. 📢 Announce to your club
3. 🔄 Set up automatic backups
4. 📊 Export and share first standings

**Long Term:**
1. 🌟 Collect feedback from students
2. 📈 Track engagement over semester
3. 🏆 Award tier prizes at end of year
4. 🔧 Request new features if needed

---

## ❓ Need Help?

1. Check the [Troubleshooting](#-troubleshooting) section above
2. Read [FREE_DEPLOYMENT_GUIDE.md](./FREE_DEPLOYMENT_GUIDE.md) for detailed steps
3. Check deployment logs in Vercel/Railway dashboard
4. Test API endpoint: `https://your-backend.com/api/health`

---

## 🎉 You're Ready!

Your club now has a professional points tracking system that:
- ✅ Works on any device (mobile-friendly)
- ✅ Saves data permanently
- ✅ Updates in real-time
- ✅ Costs $0/month to run
- ✅ Scales with your club

Happy tracking! 🚀

---

**Made with ❤️ for student organizations**

