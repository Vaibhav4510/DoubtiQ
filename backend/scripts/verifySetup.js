const mongoose = require('mongoose');
const User = require('../models/User');
const Doubt = require('../models/Doubt');
const Solution = require('../models/Solution');
const Tutor = require('../models/Tutor');
require('dotenv').config();

const verifySetup = async () => {
  try {
    console.log('🔍 Verifying DoubtiQ Setup...\n');
    
    // Check MongoDB connection
    console.log('1. Checking MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doubtiq');
    console.log('   ✅ MongoDB connected successfully\n');
    
    // Check admin user
    console.log('2. Checking admin user...');
    const admin = await User.findOne({ email: 'admin@gmail.com', role: 'admin' });
    if (admin) {
      console.log('   ✅ Admin user exists');
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🔑 Password: Admin123\n`);
    } else {
      console.log('   ⚠️  Admin user not found. Run: node scripts/setupAdmin.js\n');
    }
    
    // Check models
    console.log('3. Checking database models...');
    const userCount = await User.countDocuments();
    const doubtCount = await Doubt.countDocuments();
    const solutionCount = await Solution.countDocuments();
    const tutorCount = await Tutor.countDocuments();
    
    console.log(`   ✅ Users: ${userCount}`);
    console.log(`   ✅ Doubts: ${doubtCount}`);
    console.log(`   ✅ Solutions: ${solutionCount}`);
    console.log(`   ✅ Tutors: ${tutorCount}\n`);
    
    // Check environment variables
    console.log('4. Checking environment variables...');
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
    let allVarsPresent = true;
    
    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`   ✅ ${varName}: Set`);
      } else {
        console.log(`   ⚠️  ${varName}: Missing`);
        allVarsPresent = false;
      }
    });
    
    console.log('\n✅ Setup verification complete!');
    console.log('🚀 You can now start the server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.log('\n⚠️  Make sure:');
    console.log('   1. MongoDB is running');
    console.log('   2. .env file is configured');
    console.log('   3. All dependencies are installed');
    process.exit(1);
  }
};

verifySetup();
