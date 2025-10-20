import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'database.db');

let SQL;
let db;

/**
 * Initialize the database
 */
export async function initDatabase() {
  SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
    console.log('✅ Loaded existing database');
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
  
  // For DELETE/UPDATE, check row count before operation
  let rowsBefore = 0;
  if (sql.trim().toUpperCase().startsWith('DELETE') || sql.trim().toUpperCase().startsWith('UPDATE')) {
    // Extract table name and count rows that will be affected
    const tableMatch = sql.match(/(?:DELETE\s+FROM|UPDATE)\s+(\w+)/i);
    if (tableMatch) {
      const tableName = tableMatch[1];
      const whereMatch = sql.match(/WHERE\s+(.+?)(?:;|$)/i);
      if (whereMatch) {
        const whereClause = whereMatch[1];
        const countSql = `SELECT COUNT(*) as count FROM ${tableName} WHERE ${whereClause}`;
        const countResult = query(countSql, params);
        rowsBefore = countResult[0]?.count || 0;
      }
    }
  }
  
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
    changes: rowsBefore // Return the number of rows affected
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

