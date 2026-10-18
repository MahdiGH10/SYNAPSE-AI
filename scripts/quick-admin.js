/**
 * Quick Admin Creation Script
 * Run with: node scripts/quick-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('Set MONGODB_URI'); process.exit(1); }

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

async function createAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log('URI:', MONGODB_URI?.substring(0, 30) + '...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Admin credentials
    const adminData = {
      name: 'Admin User',
      email: 'admin@synapseai.com',
      password: 'Admin@123456',
      role: 'superadmin',
      verified: true
    };

    // Check if admin exists
    let admin = await User.findOne({ email: adminData.email });

    if (admin) {
      console.log('👤 Admin already exists, updating...');
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      admin.password = hashedPassword;
      admin.role = 'superadmin';
      admin.verified = true;
      admin.name = adminData.name;
      await admin.save();
      console.log('✅ Admin updated!\n');
    } else {
      console.log('👤 Creating new admin...');
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      admin = await User.create({
        ...adminData,
        password: hashedPassword,
      });
      console.log('✅ Admin created!\n');
    }

    // Promote your personal email
    const yourEmail = 'mgharbi031@gmail.com';
    let yourAccount = await User.findOne({ email: yourEmail });
    
    if (yourAccount) {
      console.log(`👤 Promoting ${yourEmail}...`);
      yourAccount.role = 'superadmin';
      yourAccount.verified = true;
      await yourAccount.save();
      console.log('✅ Your account promoted!\n');
    } else {
      console.log(`⚠️  Account ${yourEmail} not found (register first)\n`);
    }

    console.log('═══════════════════════════════════════');
    console.log('🎉 ADMIN ACCOUNT READY!');
    console.log('═══════════════════════════════════════');
    console.log('Email:    admin@synapseai.com');
    console.log('Password: Admin@123456');
    console.log('Role:     superadmin');
    console.log('═══════════════════════════════════════\n');
    console.log('🚀 Login at: http://localhost:3000/login\n');

    await mongoose.connection.close();
    console.log('✅ Done!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
