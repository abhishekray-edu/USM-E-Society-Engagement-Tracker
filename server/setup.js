import { hashPassword } from './auth.js';
import { initDatabase, query, run, closeDatabase } from './database.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('\n🚀 Student Points Tracker - Initial Setup\n');
  console.log('This will set up your admin credentials.\n');

  const username = await question('Enter admin username: ');
  const password = await question('Enter admin password: ');
  const confirmPassword = await question('Confirm admin password: ');

  if (password !== confirmPassword) {
    console.error('\n❌ Passwords do not match!');
    rl.close();
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('\n❌ Password must be at least 8 characters long!');
    rl.close();
    process.exit(1);
  }

  console.log('\n⏳ Setting up database...');

  await initDatabase();

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Clear existing credentials and set new ones
  run('DELETE FROM settings WHERE key IN (?, ?)', ['admin_username', 'admin_password']);
  run('INSERT INTO settings (key, value) VALUES (?, ?)', ['admin_username', username]);
  run('INSERT INTO settings (key, value) VALUES (?, ?)', ['admin_password', hashedPassword]);

  closeDatabase();

  console.log('\n✅ Setup complete!');
  console.log(`\nYour admin credentials:`);
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log('\n⚠️  Keep these credentials safe!\n');

  rl.close();
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
