# 🚀 Deployment Checklist

Use this checklist to deploy your Student Points Tracker in 15 minutes!

---

## 📋 Pre-Deployment

- [ ] Code is working locally (`npm run dev` + `npm run server`)
- [ ] Admin login works
- [ ] Can add students and points
- [ ] Created GitHub account
- [ ] Created Vercel account
- [ ] Created Railway account (or Render)

---

## 🔨 Step 1: Push to GitHub (5 min)

```bash
git init
git add .
git commit -m "Initial commit - Student Points Tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/btb.git
git push -u origin main
```

**Checklist:**
- [ ] Repository created on GitHub
- [ ] Code pushed successfully
- [ ] Can see files on GitHub.com

---

## 🖥️ Step 2: Deploy Backend (5 min)

### Railway (Recommended)

1. **Create Project**
   - [ ] Visited [railway.app](https://railway.app)
   - [ ] Signed in with GitHub
   - [ ] Clicked "New Project"
   - [ ] Selected "Deploy from GitHub repo"
   - [ ] Selected `btb` repository

2. **Configure Service**
   - [ ] Clicked on the service
   - [ ] Settings → Start Command: `node server/production.js`
   - [ ] Variables → Added `PORT=3001` (optional)

3. **Optional: Set Admin Credentials**
   - [ ] Variables → Added `ADMIN_USERNAME=your_username`
   - [ ] Variables → Added `ADMIN_PASSWORD=YourSecurePass123`

4. **Get URL**
   - [ ] Settings → Networking → Generate Domain
   - [ ] Copied Railway URL: `_______________________________`

**OR Render (Free Alternative)**

1. **Create Web Service**
   - [ ] Visited [render.com](https://render.com)
   - [ ] Signed in with GitHub
   - [ ] New + → Web Service
   - [ ] Connected `btb` repository

2. **Configure**
   - [ ] Name: `btb-tracker`
   - [ ] Environment: `Node`
   - [ ] Build: `npm install && npm run build`
   - [ ] Start: `node server/production.js`
   - [ ] Plan: Free

3. **Get URL**
   - [ ] Copied Render URL: `_______________________________`

---

## 🎨 Step 3: Deploy Frontend (5 min)

### Vercel

1. **Import Project**
   - [ ] Visited [vercel.com](https://vercel.com)
   - [ ] Signed in with GitHub
   - [ ] Clicked "Add New" → "Project"
   - [ ] Imported `btb` repository

2. **Configure**
   - [ ] Framework Preset: Vite (auto-detected)
   - [ ] Build Command: `npm run build` (auto-detected)
   - [ ] Output Directory: `dist` (auto-detected)

3. **Environment Variables**
   - [ ] Clicked "Environment Variables"
   - [ ] Added `VITE_API_URL`
   - [ ] Value: `https://YOUR-RAILWAY-URL.railway.app/api`
     (or `https://YOUR-RENDER-URL.onrender.com/api`)

4. **Deploy**
   - [ ] Clicked "Deploy"
   - [ ] Waited for deployment (1-2 min)
   - [ ] Copied Vercel URL: `_______________________________`

---

## 🔐 Step 4: Secure Your App (2 min)

1. **Test the App**
   - [ ] Visited Vercel URL
   - [ ] Can see the public leaderboard
   - [ ] "Admin Login" button appears

2. **Change Password**
   
   **If you set environment variables in Railway:**
   - [ ] Login with your custom username/password
   - [ ] Verified it works
   
   **If using default credentials:**
   - [ ] Clicked "Admin Login"
   - [ ] Logged in (username: `admin`, password: `admin123`)
   - [ ] Clicked "Change Password" button
   - [ ] Entered current password: `admin123`
   - [ ] Entered new secure password
   - [ ] Confirmed new password
   - [ ] Clicked "Change Password"
   - [ ] Saw success message

3. **Test Admin Features**
   - [ ] Added a test student
   - [ ] Added points to student
   - [ ] Exported CSV
   - [ ] Logged out and back in with new password

---

## ✅ Post-Deployment

### Immediate (Today)

- [ ] Bookmarked your app URLs
- [ ] Saved admin credentials securely (password manager)
- [ ] Tested on mobile device
- [ ] Shared public URL with one friend to test

### This Week

- [ ] Add all current club members
- [ ] Import historical data (if any)
- [ ] Announce to club
- [ ] Post URL in Discord/Slack
- [ ] Create first database backup

### Ongoing

- [ ] Weekly: Update points after events
- [ ] Weekly: Export and share standings
- [ ] Monthly: Create database backup
- [ ] Quarterly: Review and celebrate tier achievements

---

## 📝 Important URLs

Write these down:

**Frontend (Public):**
```
https://___________________________________.vercel.app
```

**Backend (API):**
```
https://___________________________________.railway.app
```
(or `.onrender.com`)

**GitHub Repository:**
```
https://github.com/_______________/btb
```

**Admin Credentials:**
```
Username: _______________
Password: (stored in password manager)
```

---

## 🎯 Success Criteria

Your deployment is successful when:

- [ ] ✅ Public leaderboard loads on any device
- [ ] ✅ Admin can login with secure credentials
- [ ] ✅ Can add students successfully
- [ ] ✅ Can add points successfully
- [ ] ✅ Points persist after page refresh
- [ ] ✅ CSV export works
- [ ] ✅ Mobile-friendly on phones
- [ ] ✅ HTTPS is working (green lock icon)

---

## 🐛 Troubleshooting

### ❌ Frontend loads but shows "Failed to load student data"

**Fix:**
1. Check VITE_API_URL in Vercel environment variables
2. Make sure it ends with `/api`
3. Test backend: visit `https://your-backend.com/api/health`
4. Check CORS settings in `server/production.js`

### ❌ Can't login with admin credentials

**Fix:**
1. If using Railway env vars, double-check they're set correctly
2. If using defaults, try `admin` / `admin123`
3. Check browser console for errors
4. Try hard refresh (Ctrl+F5)

### ❌ Vercel deployment failed

**Fix:**
1. Check build logs in Vercel dashboard
2. Verify `package.json` has correct dependencies
3. Make sure `npm run build` works locally
4. Check if `dist` folder is in `.gitignore` (it should be)

### ❌ Railway/Render deployment failed

**Fix:**
1. Check deployment logs
2. Verify start command: `node server/production.js`
3. Check if all dependencies are in `package.json`
4. Make sure `node_modules` is in `.gitignore`

---

## 🎉 Done!

If all items are checked, you've successfully deployed your Student Points Tracker!

**Next:** Share with your club and start tracking! 🚀

---

## 📞 Need Help?

- Check [QUICK_START.md](./QUICK_START.md)
- Read [FREE_DEPLOYMENT_GUIDE.md](./FREE_DEPLOYMENT_GUIDE.md)
- Review deployment logs
- Test API endpoint directly

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Club Name:** _______________

