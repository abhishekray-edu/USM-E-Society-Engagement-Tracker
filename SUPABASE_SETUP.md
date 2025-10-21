# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `usm-esociety-tracker` (or your preferred name)
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to your users
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Your Supabase Credentials

Once your project is created:

1. Go to Project Settings (gear icon in sidebar)
2. Click on "API" in the settings menu
3. Copy these values (you'll need them):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public API Key**: `eyJxxx...` (long string)

## Step 3: Create Database Tables

1. In your Supabase dashboard, go to the SQL Editor (left sidebar)
2. Click "New Query"
3. Copy and paste the SQL schema from `supabase-schema.sql` (created in this repo)
4. Click "Run" to create the tables

## Step 4: Set Environment Variables

### For Local Development:

Create a `.env` file in the project root:

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...your-anon-key
```

### For Render Deployment:

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add these environment variables:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_ANON_KEY` = your anon/public key

## Step 5: Deploy

Once environment variables are set:

1. **Local**: Restart your server (`npm run dev`)
2. **Render**: Push to GitHub (auto-deploys)

## Default Admin Credentials

The app will automatically create default admin credentials on first run:
- Username: `admin`
- Password: `efghsociety`

**Important**: Change these after first login using the admin panel!

## Data Migration (Optional)

If you have existing data in SQLite:

1. Export data from current app using the "Export to CSV" button
2. In Supabase dashboard, go to Table Editor
3. Import CSV data into respective tables

## Benefits of Supabase

✅ **Persistent Storage**: Data survives deployments and app restarts
✅ **Free Tier**: 500MB database, unlimited API requests
✅ **Scalable**: Easy to upgrade as you grow
✅ **Real-time**: Built-in real-time subscriptions (optional feature)
✅ **Backup**: Automatic daily backups on paid plans

## Troubleshooting

- **Connection Error**: Check that environment variables are set correctly
- **Table Not Found**: Make sure you ran the SQL schema in Supabase
- **Auth Issues**: Default credentials are created automatically on first run
- **CORS Issues**: Supabase allows all origins by default, but check API settings if needed

