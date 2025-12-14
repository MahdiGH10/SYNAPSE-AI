/**
 * Script to create or promote a user to SuperAdmin role
 * 
 * Usage:
 * node scripts/create-admin.js <email> [superadmin|admin]
 * 
 * Example:
 * node scripts/create-admin.js admin@example.com superadmin
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/synapseai';

// User Schema (simplified version)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: { 
    type: String, 
    enum: ['user', 'admin', 'superadmin'],
    default: 'user' 
  },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createOrPromoteAdmin(email, role = 'superadmin') {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, update role
      user.role = role;
      user.verified = true; // Ensure admin is verified
      await user.save();
      
      console.log(`\n✅ SUCCESS! User promoted to ${role}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Name: ${user.name}`);
      console.log(`🎭 Role: ${user.role}`);
      console.log(`\n✨ User can now access admin features at /admin`);
    } else {
      // User doesn't exist, create new admin
      console.log(`\n⚠️  User not found with email: ${email}`);
      console.log('📝 Creating new admin account...\n');

      // Get admin details
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const name = await new Promise(resolve => {
        readline.question('Enter admin name: ', resolve);
      });

      const password = await new Promise(resolve => {
        readline.question('Enter password (min 8 characters): ', resolve);
      });

      readline.close();

      if (password.length < 8) {
        console.error('❌ Password must be at least 8 characters');
        process.exit(1);
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        verified: true,
      });

      console.log(`\n✅ SUCCESS! Admin account created`);
      console.log(`📧 Email: ${email}`);
      console.log(`👤 Name: ${name}`);
      console.log(`🎭 Role: ${role}`);
      console.log(`\n✨ You can now login at /login with these credentials`);
    }

    console.log('\n🚀 Admin Features Available:');
    console.log('   • View Dashboard: /admin');
    console.log('   • Manage Tickets: /admin/tickets');
    console.log('   • View as User: /support');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const email = args[0];
const role = args[1] || 'superadmin';

if (!email) {
  console.error('❌ Error: Email is required');
  console.log('\nUsage:');
  console.log('  node scripts/create-admin.js <email> [superadmin|admin]');
  console.log('\nExample:');
  console.log('  node scripts/create-admin.js admin@example.com superadmin');
  process.exit(1);
}

if (!['admin', 'superadmin'].includes(role)) {
  console.error('❌ Error: Role must be "admin" or "superadmin"');
  process.exit(1);
}

// Run the script
createOrPromoteAdmin(email, role);
