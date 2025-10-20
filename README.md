# Student Points Tracker

A modern full-stack web application for tracking student participation and awarding travel support based on points earned through club activities.

## 🚀 Quick Start

**New here?** Check out [QUICK_START.md](./QUICK_START.md) for a 15-minute deployment guide!

**Want free hosting?** See [FREE_DEPLOYMENT_GUIDE.md](./FREE_DEPLOYMENT_GUIDE.md) for Vercel + Railway setup!

## Features

- ✅ **Persistent Data**: SQLite database stores all student data permanently
- 👥 **Student Management**: Add and remove students from the tracker
- 📊 **Points Tracking**: Track points across multiple event types:
  - General Meetings (1 point)
  - Guest Speaker Events (3 points)
  - CfE Events (3 points)
  - Combo Events (4 points)
- 🏆 **Tier System**: Automatic tier calculation based on points earned:
  - Bronze ($250) - 12+ points
  - Silver ($500) - 22+ points
  - Gold ($1000) - 35+ points
- 🔐 **Admin Dashboard**: Secure admin login with modal popup
- 📈 **Public Leaderboard**: Students can view rankings without admin access
- 📥 **Data Export**: Export student data to CSV
- 🔄 **Annual Reset**: Reset all points for new academic year
- 📝 **Activity Logging**: All point additions are logged with timestamps

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

### Backend
- Node.js
- Express
- SQLite (better-sqlite3)
- CORS enabled

## Getting Started

### Installation

```bash
npm install
```

### Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. (Optional) Modify the `.env` file if needed:
```env
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

### Development

You'll need to run both the backend server and the frontend development server:

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Development:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3001`.

### Production Build

1. Build the frontend:
```bash
npm run build
```

2. The built files will be in the `dist` folder. You can serve them with any static file server or configure your backend to serve them.

## Deployment

### Option 1: Deploy to a VPS (Recommended for full control)

1. **Setup your server** (Ubuntu/Debian):
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

2. **Clone and setup your app**:
```bash
git clone <your-repo>
cd btb
npm install
npm run build
```

3. **Create a production server file** (`server/production.js`):
```javascript
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import your API server
import './index.js';

const app = express();

// Serve static files from dist
app.use(express.static(join(__dirname, '../dist')));

// All other routes return the index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});
```

4. **Start with PM2**:
```bash
pm2 start server/index.js --name btb-tracker
pm2 save
pm2 startup
```

5. **Setup Nginx as reverse proxy** (optional but recommended):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Deploy to Heroku

1. Create a `Procfile`:
```
web: node server/index.js
```

2. Update `server/index.js` to serve static files in production:
```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add this after your API routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}
```

3. Deploy:
```bash
heroku create your-app-name
git push heroku main
```

### Option 3: Deploy Frontend and Backend Separately

**Frontend** (Netlify/Vercel):
- Deploy the `dist` folder
- Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`

**Backend** (Railway/Render):
- Deploy the entire project
- Set the start command to: `node server/index.js`

## Admin Access

Default credentials (⚠️ **Change these in production!**):
- Username: `admin`
- Password: `admin123`

To change credentials, modify the database settings:
```sql
UPDATE settings SET value = 'your_new_username' WHERE key = 'admin_username';
UPDATE settings SET value = 'your_new_password' WHERE key = 'admin_password';
```

## Database

The SQLite database (`server/database.db`) contains:
- **students**: Student records with points and event counts
- **activity_log**: History of all point additions
- **settings**: Admin credentials and configuration

### Backup Your Database

```bash
# Create a backup
cp server/database.db server/database.db.backup

# Restore from backup
cp server/database.db.backup server/database.db
```

## API Endpoints

- `GET /api/students` - Get all students
- `POST /api/students` - Add a new student
- `DELETE /api/students/:id` - Remove a student
- `POST /api/students/:id/points` - Add points to a student
- `GET /api/activity-log` - Get activity history
- `POST /api/reset` - Reset all points
- `POST /api/login` - Admin login
- `GET /api/health` - Health check

## Future Enhancements

- [ ] Password hashing for admin credentials
- [ ] Multiple admin roles
- [ ] Email notifications for tier achievements
- [ ] Bulk student import from CSV
- [ ] Advanced analytics and reporting
- [ ] Mobile app
- [ ] Student self-service portal

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
