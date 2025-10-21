import express from 'express';
import cors from 'cors';
import { hashPassword, comparePassword } from './auth.js';
import { initDatabase, query, queryOne, insert, update, deleteRows, closeDatabase } from './supabase.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Allow CORS from any origin for development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
  next();
});

// Initialize database
const credentialsExist = await initDatabase();

// Initialize default settings if not exist
if (!credentialsExist) {
  console.warn('⚠️  No admin credentials found! Creating default credentials.');
  console.warn('⚠️  Default: admin/efghsociety');
  const defaultPassword = await hashPassword('efghsociety');
  
  try {
    await insert('settings', { key: 'admin_username', value: 'admin' });
    await insert('settings', { key: 'admin_password', value: defaultPassword });
    console.log('✅ Default credentials created');
  } catch (error) {
    console.log('Note: Credentials may already exist');
  }
}

// API Routes

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await query('students', '*', { order: 'points DESC' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new student
app.post('/api/students', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Student name is required' });
    }

    const newStudent = await insert('students', { name: name.trim() });
    res.status(201).json(newStudent);
  } catch (error) {
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      res.status(400).json({ error: 'Student name already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Remove a student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if student exists
    const student = await queryOne('students', '*', { id });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    await deleteRows('students', { id });
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add points to a student
app.post('/api/students/:id/points', async (req, res) => {
  try {
    const { id } = req.params;
    const { eventType } = req.body;

    const pointValues = {
      meeting: 1,
      guestSpeaker: 3,
      cfe: 3,
      combo: 4
    };

    const pointsToAdd = pointValues[eventType];
    if (!pointsToAdd) {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    // Get current student
    const student = await queryOne('students', '*', { id });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update student points
    const fieldName = eventType === 'meeting' ? 'meetings' : eventType;
    const updateData = {
      points: student.points + pointsToAdd,
      [fieldName]: student[fieldName] + 1
    };
    
    await update('students', updateData, { id });

    // Log activity
    await insert('activity_log', {
      student_id: id,
      student_name: student.name,
      event_type: eventType,
      points_added: pointsToAdd
    });

    // Return updated student
    const updatedStudent = await queryOne('students', '*', { id });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get activity log
app.get('/api/activity-log', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const logs = await query('activity_log', '*', { order: 'timestamp DESC', limit });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset all points
app.post('/api/reset', async (req, res) => {
  try {
    // Get all students
    const students = await query('students', '*');
    
    // Update each student to reset points
    for (const student of students) {
      await update('students', {
        points: 0,
        meetings: 0,
        guestSpeaker: 0,
        cfe: 0,
        combo: 0
      }, { id: student.id });
    }
    
    // Log the reset
    await insert('activity_log', {
      student_id: 0,
      student_name: 'SYSTEM',
      event_type: 'reset',
      points_added: 0
    });
    
    res.json({ message: 'All points reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const storedUsername = await queryOne('settings', 'value', { key: 'admin_username' });
    const storedPassword = await queryOne('settings', 'value', { key: 'admin_password' });
    
    if (!storedUsername || !storedPassword) {
      return res.status(500).json({ success: false, message: 'Admin credentials not configured' });
    }
    
    const passwordMatch = await comparePassword(password, storedPassword.value);
    
    if (username === storedUsername.value && passwordMatch) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change admin password
app.post('/api/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }
    
    const storedPassword = await queryOne('settings', 'value', { key: 'admin_password' });
    
    if (!storedPassword) {
      return res.status(500).json({ error: 'Admin credentials not configured' });
    }
    
    const passwordMatch = await comparePassword(currentPassword, storedPassword.value);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hashedNewPassword = await hashPassword(newPassword);
    await update('settings', { value: hashedNewPassword }, { key: 'admin_password' });
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'supabase' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Database: Supabase`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

