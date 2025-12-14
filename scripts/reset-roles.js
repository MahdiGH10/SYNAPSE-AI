/**
 * Reset User Roles - Remove admin from personal account
 */

const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://skandargharbi1342_db_user:skandar9656@cluster0.uuppguj.mongodb.net/SynapseAI';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  verified: Boolean,
});

async function resetRoles() {
  try {
    console.log('🔄 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Demote personal account to user
    const personalAccount = await User.findOne({ email: 'mgharbi031@gmail.com' });
    
    if (personalAccount) {
      console.log('👤 Demoting mgharbi031@gmail.com to regular user...');
      personalAccount.role = 'user';
      await personalAccount.save();
      console.log('✅ mgharbi031@gmail.com is now a regular user\n');
    } else {
      console.log('⚠️  mgharbi031@gmail.com not found\n');
    }

    // Verify admin account
    const adminAccount = await User.findOne({ email: 'admin@synapseai.com' });
    
    if (adminAccount) {
      console.log('✅ Verified admin@synapseai.com status:');
      console.log('   Role:', adminAccount.role);
      console.log('   Verified:', adminAccount.verified);
      console.log('\n');
    } else {
      console.log('❌ admin@synapseai.com not found!\n');
    }

    console.log('═══════════════════════════════════════');
    console.log('🎉 ROLES UPDATED!');
    console.log('═══════════════════════════════════════');
    console.log('✅ admin@synapseai.com - superadmin');
    console.log('✅ mgharbi031@gmail.com - user');
    console.log('═══════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetRoles();
