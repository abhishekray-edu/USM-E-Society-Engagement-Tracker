import { hashPassword } from './server/auth.js';
import { initDatabase, run, closeDatabase } from './server/database.js';

async function resetPassword() {
  console.log('\n🔐 Password Reset Tool\n');
  
  const username = 'admin';
  const password = 'admin123';
  
  await initDatabase();
  
  const hashedPassword = await hashPassword(password);
  
  // Delete and recreate credentials
  run('DELETE FROM settings WHERE key IN (?, ?)', ['admin_username', 'admin_password']);
  run('INSERT INTO settings (key, value) VALUES (?, ?)', ['admin_username', username]);
  run('INSERT INTO settings (key, value) VALUES (?, ?)', ['admin_password', hashedPassword]);
  
  closeDatabase();
  
  console.log('✅ Password reset successfully!');
  console.log('\nYour credentials:');
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log('\n⚠️  Please login and change your password immediately!\n');
  
  process.exit(0);
}

resetPassword().catch(err => {
  console.error('❌ Reset failed:', err);
  process.exit(1);
});

