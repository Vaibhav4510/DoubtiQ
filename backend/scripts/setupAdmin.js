const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doubtiq');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    let admin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (admin) {
      // Update existing admin
      admin.name = 'Admin';
      admin.password = 'Admin123';
      admin.role = 'admin';
      await admin.save();
      console.log('Admin user updated successfully!');
    } else {
      // Create new admin
      admin = await User.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'Admin123',
        role: 'admin'
      });
      console.log('Admin user created successfully!');
    }

    console.log('\n=== Admin Credentials ===');
    console.log('Email: admin@gmail.com');
    console.log('Password: Admin123');
    console.log('========================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setupAdmin();
