-- Supabase Database Schema for USM E-Society Engagement Tracker
-- Run this SQL in your Supabase SQL Editor to create the tables

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  points INTEGER DEFAULT 0,
  meetings INTEGER DEFAULT 0,
  "guestSpeaker" INTEGER DEFAULT 0,
  cfe INTEGER DEFAULT 0,
  combo INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL,
  student_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  points_added INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (for admin credentials)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_points ON students(points DESC);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_student_id ON activity_log(student_id);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since we're handling auth in our backend)
-- These policies allow anonymous access, which is fine since our backend handles authentication

-- Students policies
CREATE POLICY "Allow all operations on students" ON students
  FOR ALL USING (true) WITH CHECK (true);

-- Activity log policies
CREATE POLICY "Allow all operations on activity_log" ON activity_log
  FOR ALL USING (true) WITH CHECK (true);

-- Settings policies
CREATE POLICY "Allow all operations on settings" ON settings
  FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample data (optional - you can remove this if you want to start fresh)
INSERT INTO students (name, points, meetings, "guestSpeaker", cfe, combo)
VALUES 
  ('John Doe', 0, 0, 0, 0, 0),
  ('Jane Smith', 0, 0, 0, 0, 0),
  ('Bob Johnson', 0, 0, 0, 0, 0)
ON CONFLICT (name) DO NOTHING;

-- Success message
SELECT 'Database schema created successfully!' as message;

