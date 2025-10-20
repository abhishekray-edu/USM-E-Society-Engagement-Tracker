# Seed Database

This directory contains the initial database that will be used when deploying to production.

## `initial.db`

This is a snapshot of the database with pre-populated student data. When the app is deployed to Render (or any fresh environment), it will:

1. Check if `server/database.db` exists
2. If not, copy `server/seed/initial.db` as the starting point
3. Use that as the runtime database

## Important Notes

⚠️ **This database is committed to Git** and will be publicly visible in your GitHub repository.

**Make sure it contains:**
- ✅ Default admin credentials (admin/admin123)
- ✅ Student names and points (OK for a club tracker)
- ❌ NO sensitive personal information
- ❌ NO real passwords (only hashed default password)

## Updating the Seed Database

If you want to update the initial data for future deployments:

```bash
# Copy your current database as the new seed
cp server/database.db server/seed/initial.db

# Commit the changes
git add server/seed/initial.db
git commit -m "Update seed database"
git push
```

## Important: Render Free Tier Limitation

⚠️ **Render's free tier does NOT have persistent storage!**

This means:
- ✅ Data persists **between user sessions** (while the app is running)
- ❌ Data is **LOST when the app sleeps** (after 15 min of inactivity)
- ❌ Data is **LOST on every new deployment**

### What Happens on Render Free Tier:

1. **First visit**: Loads seed database with all students ✅
2. **Add new students**: Works fine, data persists ✅
3. **App sleeps (15 min idle)**: Data is LOST ❌
4. **Next visit**: Starts fresh from seed database again

### Solution Options:

1. **Export to CSV regularly** - Use the "Export to CSV" button in admin panel
2. **Upgrade to Render paid plan** - $7/month for persistent disk
3. **Use a proper database** - PostgreSQL, MySQL (free tiers available)
4. **Accept data loss** - Just use it for demo/testing purposes

For a production club tracker, you should upgrade to a paid plan or use a proper database service.

