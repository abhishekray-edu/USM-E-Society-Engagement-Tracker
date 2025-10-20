# 🚀 Deploy to Render (Free Hosting)

This guide will help you deploy your USM E-Society Points Tracker to Render **completely free**.

---

## ✅ What You'll Get

- 🌐 **Public URL** - Anyone can access your app
- 💾 **Persistent Database** - SQLite database stored on Render's disk
- 🔒 **Secure** - HTTPS enabled by default
- 🆓 **100% Free** - No credit card required

---

## 📋 Prerequisites

1. ✅ GitHub account with your code pushed (you already have this!)
2. ✅ Render account - Sign up at [render.com](https://render.com) with your GitHub

---

## 🚀 Deployment Steps

### Step 1: Create a Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account**
4. Authorize Render to access your repositories

### Step 2: Create a New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: **`abhishekray-edu/USM-E-Society-Engagement-Tracker`**

### Step 3: Configure Your Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `usm-esociety-tracker` (or any name you like) |
| **Region** | Choose closest to you (e.g., Oregon) |
| **Branch** | `main` |
| **Root Directory** | *(leave blank)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node server/production.js` |
| **Plan** | **Free** ⭐ |

### Step 4: Environment Variables (Optional)

If you want to set a custom admin password right away:

1. Scroll down to **"Environment Variables"**
2. Click **"Add Environment Variable"**
3. Add these:

```
ADMIN_USERNAME = admin
ADMIN_PASSWORD = YourSecurePassword123
NODE_ENV = production
```

**Note:** If you don't set these, the app will use default credentials:
- Username: `admin`
- Password: `admin123`

⚠️ **You can change the password later from the admin panel!**

### Step 5: Deploy!

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying your app
3. Watch the logs - it takes about 2-3 minutes
4. Look for: `✅ Server running on port 10000`

### Step 6: Get Your URL

Once deployed (you'll see "Live" with a green dot):

1. At the top, you'll see your URL:
   ```
   https://usm-esociety-tracker.onrender.com
   ```
2. Click it to open your app!
3. **Share this URL** with everyone who needs access

---

## 🎉 You're Live!

Your app is now accessible to anyone at:
```
https://your-app-name.onrender.com
```

### 🔐 First Login

1. Click **"Admin Login"** button
2. Use credentials:
   - Username: `admin`
   - Password: `admin123` (or your custom password)
3. **Change your password immediately!**
   - Click the gear icon (⚙️) next to "Logout"
   - Enter current password and new password

---

## 📝 Important Notes

### ⚠️ Free Tier Limitations

- **Spins down after 15 minutes** of inactivity
- **First visit** after inactivity takes ~30 seconds to wake up
- **750 hours/month** of runtime (plenty for a club tracker!)

### 💾 Database Persistence

- Your SQLite database is stored on Render's disk
- **Data persists** across deploys
- To download a backup, you can use the "Export to CSV" feature in the admin panel

### 🔄 Auto-Deploy

- Every time you push to GitHub, Render **automatically redeploys**
- No manual steps needed after initial setup!

### 🌐 Custom Domain (Optional)

Want a custom domain like `points.esmclub.com`?

1. Go to your service → **"Settings"** → **"Custom Domain"**
2. Add your domain
3. Update your DNS settings as instructed

---

## 🔧 Troubleshooting

### App won't start?

Check the logs:
1. Go to your service on Render
2. Click **"Logs"** tab
3. Look for error messages

### Database reset?

If your database gets wiped:
1. Check if you have a backup CSV export
2. Re-add students manually or import

### Can't log in?

Reset your password by redeploying with environment variables:
1. Go to **"Environment"** tab
2. Update `ADMIN_PASSWORD`
3. Click **"Save Changes"**
4. Render will automatically redeploy

---

## 🎓 For USM E-Society Members

Your points tracker is now live! Share the URL with:
- ✅ Club members (to check their points)
- ✅ Board members (to record attendance)
- ✅ Faculty advisors

Everyone sees the **same data** in real-time!

---

## 📞 Need Help?

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **GitHub Issues**: Create an issue in your repository
- **Check Logs**: Always check the Render logs first

---

**🎊 Congratulations! Your app is deployed!** 🎊

