/**
 * Check Admin Account
 */

const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://skandargharbi1342_db_user:skandar9656@cluster0.uuppguj.mongodb.net/SynapseAI';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  verified: Boolean,
  googleId: String,
});

async function checkAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check admin account
    const admin = await User.findOne({ email: 'admin@synapseai.com' });
    
    if (admin) {
      console.log('═══════════════════════════════════════');
      console.log('📋 Admin Account Details:');
      console.log('═══════════════════════════════════════');
      console.log('Email:', admin.email);
      console.log('Name:', admin.name);
      console.log('Role:', admin.role);
      console.log('Verified:', admin.verified);
      console.log('Has Password:', !!admin.password);
      console.log('═══════════════════════════════════════\n');
    } else {
      console.log('❌ Admin account not found!\n');
    }

    // Check your account
    const yourAccount = await User.findOne({ email: 'mgharbi031@gmail.com' });
    
    if (yourAccount) {
      console.log('═══════════════════════════════════════');
      console.log('📋 Your Account Details:');
      console.log('═══════════════════════════════════════');
      console.log('Email:', yourAccount.email);
      console.log('Name:', yourAccount.name);
      console.log('Role:', yourAccount.role);
      console.log('Verified:', yourAccount.verified);
      console.log('═══════════════════════════════════════\n');
    } else {
      console.log('⚠️  Your account not found (register first)\n');
    }

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdmin();
