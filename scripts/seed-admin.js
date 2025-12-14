/**
 * Seed Default Admin Account
 * Creates a ready-to-use admin account for immediate login
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/synapseai';

// Default Admin Credentials
const DEFAULT_ADMIN = {
  name: 'Admin User',
  email: 'admin@synapseai.com',
  password: 'Admin@123456',
  role: 'superadmin',
  verified: true
};

// Your personal admin
const YOUR_ADMIN = {
  email: 'mgharbi031@gmail.com',
  role: 'superadmin',
  verified: true
};

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  verified: { type: Boolean, default: false },
  googleId: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

async function seedAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Create/Update Default Admin
    console.log('👤 Setting up default admin account...');
    let defaultAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });

    if (defaultAdmin) {
      console.log('   ℹ️  Default admin already exists, updating...');
      defaultAdmin.role = DEFAULT_ADMIN.role;
      defaultAdmin.verified = DEFAULT_ADMIN.verified;
      await defaultAdmin.save();
    } else {
      console.log('   ➕ Creating new default admin...');
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, salt);
      
      defaultAdmin = await User.create({
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        password: hashedPassword,
        role: DEFAULT_ADMIN.role,
        verified: DEFAULT_ADMIN.verified,
      });
    }

    console.log('   ✅ Default admin ready!\n');

    // Promote your account
    console.log('👤 Setting up your admin account...');
    let yourAdmin = await User.findOne({ email: YOUR_ADMIN.email });

    if (yourAdmin) {
      console.log('   ℹ️  Your account found, promoting to superadmin...');
      yourAdmin.role = YOUR_ADMIN.role;
      yourAdmin.verified = YOUR_ADMIN.verified;
      await yourAdmin.save();
      console.log('   ✅ Your account promoted!\n');
    } else {
      console.log('   ⚠️  Account not found. Please register first.\n');
    }

    // Display Results
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ADMIN ACCOUNTS READY!\n');
    
    console.log('📋 DEFAULT ADMIN CREDENTIALS:');
    console.log('   Email:    admin@synapseai.com');
    console.log('   Password: Admin@123456');
    console.log('   Role:     superadmin\n');

    if (yourAdmin) {
      console.log('📋 YOUR ADMIN ACCOUNT:');
      console.log('   Email:    mgharbi031@gmail.com');
      console.log('   Role:     superadmin\n');
    }

    console.log('🚀 LOGIN URL:');
    console.log('   http://localhost:3000/login\n');

    console.log('🎯 ADMIN FEATURES:');
    console.log('   • Dashboard:        /admin');
    console.log('   • Ticket Management: /admin/tickets');
    console.log('   • User Management:   /admin/users');
    console.log('   • Reports:          /admin/reports\n');

    console.log('⚠️  SECURITY NOTE:');
    console.log('   Change default password after first login!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate email detected. Admin may already exist.');
    }
    process.exit(1);
  }
}

seedAdmin();
