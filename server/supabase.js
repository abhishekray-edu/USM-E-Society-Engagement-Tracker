import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  console.error('See SUPABASE_SETUP.md for instructions.');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Initialize database - ensures tables exist and creates default admin credentials
 */
export async function initDatabase() {
  console.log('✅ Connected to Supabase');
  
  // Check if settings table has admin credentials
  const { data: settings, error } = await supabase
    .from('settings')
    .select('key')
    .in('key', ['admin_username', 'admin_password']);
  
  if (error) {
    console.error('Error checking settings:', error);
    return;
  }
  
  // Return whether credentials exist
  return settings && settings.length >= 2;
}

/**
 * Execute a SELECT query and return all results
 */
export async function query(table, selectQuery = '*', filters = {}) {
  let queryBuilder = supabase.from(table).select(selectQuery);
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'order') {
      const [column, direction] = value.split(' ');
      queryBuilder = queryBuilder.order(column, { ascending: direction !== 'DESC' });
    } else if (key === 'limit') {
      queryBuilder = queryBuilder.limit(value);
    } else if (key === 'in') {
      queryBuilder = queryBuilder.in(value.column, value.values);
    } else {
      queryBuilder = queryBuilder.eq(key, value);
    }
  });
  
  const { data, error } = await queryBuilder;
  
  if (error) {
    console.error('Query error:', error);
    throw new Error(error.message);
  }
  
  return data || [];
}

/**
 * Execute a SELECT query and return first result
 */
export async function queryOne(table, selectQuery = '*', filters = {}) {
  const results = await query(table, selectQuery, { ...filters, limit: 1 });
  return results.length > 0 ? results[0] : null;
}

/**
 * Insert a new row
 */
export async function insert(table, data) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('Insert error:', error);
    throw new Error(error.message);
  }
  
  return result;
}

/**
 * Update rows
 */
export async function update(table, data, filters = {}) {
  let queryBuilder = supabase.from(table).update(data);
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    queryBuilder = queryBuilder.eq(key, value);
  });
  
  const { data: result, error } = await queryBuilder.select();
  
  if (error) {
    console.error('Update error:', error);
    throw new Error(error.message);
  }
  
  return result;
}

/**
 * Delete rows
 */
export async function deleteRows(table, filters = {}) {
  let queryBuilder = supabase.from(table).delete();
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    queryBuilder = queryBuilder.eq(key, value);
  });
  
  const { error } = await queryBuilder;
  
  if (error) {
    console.error('Delete error:', error);
    throw new Error(error.message);
  }
  
  return { success: true };
}

/**
 * Execute raw SQL (for complex queries)
 */
export async function rpc(functionName, params = {}) {
  const { data, error } = await supabase.rpc(functionName, params);
  
  if (error) {
    console.error('RPC error:', error);
    throw new Error(error.message);
  }
  
  return data;
}

/**
 * Increment a numeric field
 */
export async function increment(table, id, field, amount = 1) {
  // First get current value
  const current = await queryOne(table, field, { id });
  
  if (!current) {
    throw new Error('Record not found');
  }
  
  const newValue = (current[field] || 0) + amount;
  
  return await update(table, { [field]: newValue }, { id });
}

export function closeDatabase() {
  // Supabase client doesn't need explicit closing
  console.log('✅ Supabase connection closed');
}

