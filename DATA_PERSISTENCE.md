# 💾 Data Persistence Guide

## 🤔 Why Does Data Get Erased?

When you deploy to **Render's free tier**, your data gets erased because:

1. **Free tier = No persistent disk storage**
2. **App "sleeps" after 15 minutes** of inactivity
3. **On wake-up, a fresh container starts** with no saved data
4. **Every deployment rebuilds** the container from scratch

---

## ✅ What I've Set Up For You

### **Seed Database**

Your app now includes a **seed database** (`server/seed/initial.db`) with all 25 students currently in your database.

**How it works:**

1. **First deployment** → Loads seed database with all students ✅
2. **Students can be added/removed** → Changes persist while app is running ✅
3. **App sleeps or redeploys** → Resets to seed database ❌
4. **Next wake-up** → Starts fresh with the original 25 students ✅

---

## 📊 Current Seed Database Contains:

- ✅ **25 students** with their current points
- ✅ **Admin credentials** (admin/admin123)
- ✅ **All point categories** (meetings, guest speakers, CfE, combo)

### Top Students in Seed:
1. Rochak Basnet - 6 points
2. Key'Shawn Kennedy - 5 points
3. Om Nepal - 5 points
4. Mandip Adhikari - 4 points
5. Saleep Shrestha - 4 points

---

## 🔄 How to Update Seed Database

If you want to update the "starting point" for future deployments:

### **Step 1: Update Your Local Database**
1. Run the app locally
2. Add/modify students as needed
3. Record points, etc.

### **Step 2: Save as New Seed**
```bash
# Copy your current database as the new seed
cp server/database.db server/seed/initial.db
```

### **Step 3: Commit and Push**
```bash
git add server/seed/initial.db
git commit -m "Update seed database with latest student data"
git push
```

### **Step 4: Redeploy on Render**
Render will automatically redeploy with the new seed data!

---

## ⚠️ Important: Render Free Tier Limitations

| Scenario | What Happens | Data Persists? |
|----------|-------------|----------------|
| **Users viewing the app** | Data stays in memory | ✅ Yes |
| **Admin adds students** | Changes saved to disk | ✅ Yes (temporarily) |
| **App is actively used** | Everything works normally | ✅ Yes |
| **15 min of inactivity** | App sleeps, disk wiped | ❌ Data LOST |
| **Next visitor** | App wakes up from seed | ⚠️ Reset to seed |
| **You push code update** | Rebuild & redeploy | ❌ Data LOST |

---

## 💡 Solutions for Production Use

### **Option 1: Export Regularly (FREE)**
- Use the **"Export to CSV"** button in admin panel
- Download backups regularly
- Accept that data resets between sessions

**Good for:** Demo, testing, small clubs with manual backups

### **Option 2: Upgrade Render ($7/month)**
- Get **persistent disk storage**
- Data survives sleep and redeployments
- Most cost-effective for a single app

**Good for:** Production use, active clubs

### **Option 3: Use PostgreSQL Database (FREE)**
- Switch from SQLite to PostgreSQL
- Use free tier from:
  - **Supabase** (500MB free)
  - **Neon** (512MB free)
  - **ElephantSQL** (20MB free)
- Requires code changes

**Good for:** Long-term production, multiple apps

### **Option 4: Use Vercel + Render**
- Deploy frontend on Vercel (free, fast)
- Deploy backend on Render with persistent disk ($7/month)
- Best performance

**Good for:** High-traffic production apps

---

## 🎯 Recommended Approach

### **For Testing/Demo (Now - FREE):**
1. Deploy to Render free tier ✅
2. It will load your 25 students from seed ✅
3. Accept that data resets when app sleeps
4. Use "Export to CSV" to backup manually

### **For Production Use ($7/month):**
1. Same Render deployment
2. Upgrade to Render paid plan
3. Enable persistent disk
4. Data survives everything!

---

## 📝 Current Setup Summary

✅ **Seed database included** - Your 25 students will always be there on fresh start
✅ **Admin password secure** - Hashed in the database
✅ **Easy to update** - Just copy and push new seed
✅ **Works on free tier** - Good for demo and testing
⚠️ **Data resets on sleep** - Expected behavior on free tier

---

## 🚀 Next Steps

1. **Deploy to Render** following `DEPLOY_NOW.md`
2. **Test it out** - Add students, record points
3. **Export to CSV** regularly if using free tier
4. **Upgrade when ready** for production use

---

**Your data strategy is now set up! 🎉**

