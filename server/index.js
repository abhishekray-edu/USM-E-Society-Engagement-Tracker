import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { hashPassword, comparePassword } from './auth.js';
import { initDatabase, query, queryOne, run, closeDatabase } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initDatabase();

// Initialize default settings if not exist (only for development)
const settingsCount = queryOne('SELECT COUNT(*) as count FROM settings');
if (settingsCount.count === 0) {
  console.warn('⚠️  No admin credentials found! Using default credentials.');
  console.warn('⚠️  Run "npm run setup" to create secure credentials.');
  const defaultPassword = await hashPassword('admin123');
  run('INSERT INTO settings (key, value) VALUES (?, ?)', ['admin_username', 'admin']);
  run('INSERT INTO settings (key, value) VALUES (?, ?)', ['admin_password', defaultPassword]);
}

// API Routes

// Get all students
app.get('/api/students', (req, res) => {
  try {
    const students = query('SELECT * FROM students ORDER BY points DESC');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new student
app.post('/api/students', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Student name is required' });
    }

    const result = run('INSERT INTO students (name) VALUES (?)', [name.trim()]);
    const newStudent = queryOne('SELECT * FROM students WHERE id = ?', [result.lastInsertRowid]);
    
    res.status(201).json(newStudent);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Student name already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Remove a student
app.delete('/api/students/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = run('DELETE FROM students WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add points to a student
app.post('/api/students/:id/points', (req, res) => {
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
    const student = queryOne('SELECT * FROM students WHERE id = ?', [id]);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update student points
    const fieldName = eventType === 'meeting' ? 'meetings' : eventType;
    run(`
      UPDATE students 
      SET points = points + ?,
          ${fieldName} = ${fieldName} + 1
      WHERE id = ?
    `, [pointsToAdd, id]);

    // Log activity
    run(`
      INSERT INTO activity_log (student_id, student_name, event_type, points_added)
      VALUES (?, ?, ?, ?)
    `, [id, student.name, eventType, pointsToAdd]);

    // Return updated student
    const updatedStudent = queryOne('SELECT * FROM students WHERE id = ?', [id]);
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get activity log
app.get('/api/activity-log', (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const logs = query('SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT ?', [limit]);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset all points
app.post('/api/reset', (req, res) => {
  try {
    run('UPDATE students SET points = 0, meetings = 0, guestSpeaker = 0, cfe = 0, combo = 0');
    
    // Log the reset
    run(`
      INSERT INTO activity_log (student_id, student_name, event_type, points_added)
      VALUES (0, 'SYSTEM', 'reset', 0)
    `);
    
    res.json({ message: 'All points reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const storedUsername = queryOne('SELECT value FROM settings WHERE key = ?', ['admin_username']);
    const storedPassword = queryOne('SELECT value FROM settings WHERE key = ?', ['admin_password']);
    
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
    
    const storedPassword = queryOne('SELECT value FROM settings WHERE key = ?', ['admin_password']);
    
    if (!storedPassword) {
      return res.status(500).json({ error: 'Admin credentials not configured' });
    }
    
    const passwordMatch = await comparePassword(currentPassword, storedPassword.value);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hashedNewPassword = await hashPassword(newPassword);
    run('UPDATE settings SET value = ? WHERE key = ?', [hashedNewPassword, 'admin_password']);
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://10.0.0.162:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});
