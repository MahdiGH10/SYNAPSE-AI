const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/synapseai';

async function promoteUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      name: String,
      role: String,
      verified: Boolean,
    }));

    const user = await User.findOne({ email: 'mgharbi031@gmail.com' });

    if (user) {
      user.role = 'superadmin';
      user.verified = true;
      await user.save();
      
      console.log('✅ SUCCESS! You are now a superadmin\n');
      console.log('📧 Email:', user.email);
      console.log('👤 Name:', user.name);
      console.log('🎭 Role:', user.role);
      console.log('\n🚀 You can now access:');
      console.log('   • Admin Dashboard: http://localhost:3000/admin');
      console.log('   • Ticket Management: http://localhost:3000/admin/tickets');
      console.log('   • Support Center: http://localhost:3000/support');
    } else {
      console.log('⚠️  User not found with email: mgharbi031@gmail.com');
      console.log('📝 Please register first at: http://localhost:3000/register');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

promoteUser();
