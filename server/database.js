import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'database.db');
const SEED_DB_PATH = join(__dirname, 'seed', 'initial.db');

let SQL;
let db;

/**
 * Initialize the database
 */
export async function initDatabase() {
  SQL = await initSqlJs();
  
  // Load existing database, or seed database, or create new one
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
    console.log('✅ Loaded existing database');
  } else if (existsSync(SEED_DB_PATH)) {
    // First deployment - use seed database
    const buffer = readFileSync(SEED_DB_PATH);
    db = new SQL.Database(buffer);
    console.log('✅ Initialized from seed database with existing student data');
    // Save it as the runtime database
    saveDatabase();
  } else {
    db = new SQL.Database();
    console.log('✅ Created new database');
  }
  
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      points INTEGER DEFAULT 0,
      meetings INTEGER DEFAULT 0,
      guestSpeaker INTEGER DEFAULT 0,
      cfe INTEGER DEFAULT 0,
      combo INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      student_name TEXT NOT NULL,
      event_type TEXT NOT NULL,
      points_added INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  
  // Save after initialization
  saveDatabase();
  
  return db;
}

/**
 * Get the database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Save database to disk
 */
export function saveDatabase() {
  if (!db) return;
  
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(DB_PATH, buffer);
}

/**
 * Execute a query and return results
 */
export function query(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  
  const results = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    // Create a new object to avoid reference issues
    results.push({ ...row });
  }
  stmt.free();
  
  return results;
}

/**
 * Execute a query and return first result
 */
export function queryOne(sql, params = []) {
  const results = query(sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Execute a statement (INSERT, UPDATE, DELETE)
 */
export function run(sql, params = []) {
  const db = getDatabase();
  
  // For DELETE/UPDATE, we'll count changes after execution
  // sql.js doesn't provide a direct way to get affected rows, so we'll estimate
  let estimatedChanges = 1; // Default assumption for UPDATE/DELETE with WHERE clause
  
  // Use prepared statement with proper parameter binding
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();
  
  saveDatabase();
  
  // Get last insert ID if applicable
  const lastId = query('SELECT last_insert_rowid() as id');
  return {
    lastInsertRowid: lastId[0]?.id || 0,
    changes: estimatedChanges
  };
}

/**
 * Close database connection
 */
export function closeDatabase() {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
  }
}

