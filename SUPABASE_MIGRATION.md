# Migrating to Supabase - Complete Guide

This guide will help you migrate from SQLite to Supabase for persistent data storage.

## Why Migrate to Supabase?

**Current Issue with SQLite on Render Free Tier:**
- ❌ Data is lost when app sleeps (after 15 min inactivity)
- ❌ Data is lost on every new deployment
- ❌ No persistent storage

**Benefits with Supabase:**
- ✅ Persistent data storage (survives deployments)
- ✅ Free tier with 500MB database
- ✅ Real-time capabilities
- ✅ Better scalability

---

## Step-by-Step Migration

### 1. Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `usm-esociety-tracker`
   - **Database Password**: Generate and save it
   - **Region**: Choose closest to you (e.g., US East)
5. Click **"Create new project"** (takes ~2 minutes)

### 2. Set Up Database Tables (2 minutes)

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` from this repo
4. Copy and paste the entire SQL content
5. Click **"Run"** to execute
6. You should see: "Database schema created successfully!"

### 3. Get Your Supabase Credentials (1 minute)

1. In Supabase dashboard, click **Settings** (gear icon)
2. Go to **API** section
3. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

### 4. Configure Local Development (2 minutes)

Create a `.env` file in the project root:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your-full-key-here
```

**Important:** Replace with your actual values from Step 3!

### 5. Test Locally (2 minutes)

```bash
# Start the Supabase version
npm run server:supabase
```

In another terminal:
```bash
# Start the frontend
npm run dev
```

Visit `http://localhost:5173` and test:
- ✅ Can view students
- ✅ Can add students
- ✅ Can add points
- ✅ Can login (admin/efghsociety)

### 6. Deploy to Render (5 minutes)

#### Option A: Update Existing Render Service

1. Go to your Render dashboard
2. Select your web service
3. Go to **Environment** tab
4. Add environment variables:
   - Key: `SUPABASE_URL`, Value: Your Supabase URL
   - Key: `SUPABASE_ANON_KEY`, Value: Your anon key
5. Click **"Save Changes"**
6. Go to **Settings** tab
7. Update **Start Command** to: `node server/production-supabase.js`
8. Click **"Save Changes"**
9. Render will auto-deploy

#### Option B: Create New Render Service

1. Push code to GitHub (see Step 7)
2. In Render, create new **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `usm-esociety-tracker`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/production-supabase.js`
5. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
6. Click **"Create Web Service"**

### 7. Commit Changes to GitHub (2 minutes)

```bash
# Check what changed
git status

# Add all new files
git add .

# Commit
git commit -m "Add Supabase database integration for persistent storage"

# Push to GitHub
git push origin main
```

---

## File Changes Summary

### New Files Created:
- ✅ `server/supabase.js` - Supabase database wrapper
- ✅ `server/index-supabase.js` - Development server with Supabase
- ✅ `server/production-supabase.js` - Production server with Supabase
- ✅ `supabase-schema.sql` - Database schema
- ✅ `SUPABASE_SETUP.md` - Setup guide
- ✅ `SUPABASE_MIGRATION.md` - This migration guide
- ✅ `.env.example` - Environment variables template

### Modified Files:
- ✅ `package.json` - Added Supabase scripts and dependency

### Old Files (Keep for Backup):
- `server/index.js` - SQLite version (keep as backup)
- `server/database.js` - SQLite wrapper (keep as backup)
- `server/production.js` - SQLite production (keep as backup)

---

## Switching Between SQLite and Supabase

### Use SQLite (Current):
```bash
npm run server           # Development
npm run start            # Production
```

### Use Supabase (New):
```bash
npm run server:supabase  # Development
npm run start:supabase   # Production
```

---

## Migrating Existing Data (Optional)

If you have existing student data in SQLite:

### Option 1: Manual Entry (Small Dataset)
Just add students again through the admin panel.

### Option 2: CSV Import (Larger Dataset)

1. In your old app, click **"Export to CSV"** in admin panel
2. In Supabase dashboard:
   - Go to **Table Editor**
   - Select `students` table
   - Click **"Insert"** → **"Import from CSV"**
   - Upload your CSV file

### Option 3: Direct SQL Insert (Advanced)

```sql
INSERT INTO students (name, points, meetings, "guestSpeaker", cfe, combo)
VALUES 
  ('Student 1', 10, 5, 2, 1, 0),
  ('Student 2', 15, 8, 3, 2, 1);
```

---

## Default Credentials

After setup, default admin login:
- **Username**: `admin`
- **Password**: `efghsociety`

**⚠️ IMPORTANT:** Change password after first login!

---

## Troubleshooting

### Error: "Missing Supabase credentials"
- ✅ Check `.env` file exists with correct values
- ✅ Restart server after creating `.env`
- ✅ On Render, verify environment variables are set

### Error: "relation does not exist"
- ✅ Run the SQL schema in Supabase SQL Editor
- ✅ Check you're connected to the right project

### Login not working
- ✅ Check that settings table was created
- ✅ Server logs should show "Default credentials created"
- ✅ Try default credentials: admin/efghsociety

### Data not saving
- ✅ Check Supabase dashboard → Table Editor → Activity log
- ✅ Verify RLS policies are set correctly (schema does this)
- ✅ Check browser console for errors

### CORS errors
- ✅ Supabase allows all origins by default
- ✅ Check API settings in Supabase if issues persist

---

## Verification Checklist

After migration, verify:

- [ ] Can view existing/sample students
- [ ] Can add new student
- [ ] Can add points to student
- [ ] Points persist after page refresh
- [ ] Can login to admin panel
- [ ] Can export data to CSV
- [ ] Can reset all points
- [ ] Activity log shows recent actions
- [ ] Data persists after Render app sleeps
- [ ] Data persists after redeployment

---

## Cost

**Supabase Free Tier:**
- ✅ 500 MB database storage
- ✅ Unlimited API requests
- ✅ 50,000 monthly active users
- ✅ 500 MB file storage
- ✅ 2 GB bandwidth

This should be **more than enough** for a student club tracker!

**Upgrade if needed:**
- Pro: $25/month (8 GB database, daily backups)

---

## Rollback Plan

If you need to go back to SQLite:

1. In Render settings, change Start Command back to:
   ```
   node server/production.js
   ```

2. Remove Supabase environment variables

3. Redeploy

All SQLite files are still in the repo as backup!

---

## Support

If you run into issues:

1. Check Supabase logs: Dashboard → Logs
2. Check Render logs: Dashboard → Logs
3. Check browser console (F12)
4. Review `SUPABASE_SETUP.md` for detailed setup

---

## Next Steps After Migration

1. ✅ Test all functionality
2. ✅ Change admin password
3. ✅ Add your student roster
4. ✅ Share the URL with your team
5. ✅ Set up regular CSV exports (optional backup)

Enjoy persistent data storage! 🎉

