# DoubtiQ Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Setup Backend Environment**
   ```bash
   cd backend
   # Create .env file manually or copy from .env.example
   ```
   
   Create `backend/.env` with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/doubtiq
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. **Start MongoDB**
   - Make sure MongoDB is installed and running
   - Or use MongoDB Atlas (cloud) and update MONGODB_URI

4. **Create Admin User**
   
   You can create an admin user in two ways:
   
   **Option 1: Using MongoDB directly**
   ```javascript
   // Connect to MongoDB and run:
   db.users.insertOne({
     name: "Admin",
     email: "admin@doubtiq.com",
     password: "$2a$10$...", // Use bcrypt to hash your password
     role: "admin",
     subscription: { type: "free", isActive: false },
     createdAt: new Date()
   })
   ```
   
   **Option 2: Modify registration route temporarily**
   - Temporarily allow admin registration in `backend/routes/auth.js`
   - Register as admin, then revert the change

5. **Run the Application**
   ```bash
   # From root directory
   npm run dev
   ```
   
   This starts:
   - Backend server on http://localhost:5000
   - Frontend app on http://localhost:3000

## Creating Your First Admin User

### Method 1: Using Node.js Script

Create a file `backend/scripts/createAdmin.js`:

```javascript
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@doubtiq.com',
      password: 'admin123', // Will be hashed automatically
      role: 'admin'
    });
    console.log('Admin user created:', admin);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
```

Run it:
```bash
cd backend
node scripts/createAdmin.js
```

### Method 2: Using MongoDB Shell

```javascript
use doubtiq
db.users.insertOne({
  name: "Admin",
  email: "admin@doubtiq.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // "admin123"
  role: "admin",
  subscription: { type: "free", isActive: false },
  createdAt: new Date()
})
```

## Testing the Application

1. **Register as Student**: Go to `/register` and create a student account
2. **Upload a Doubt**: Go to home page and upload an image or type text
3. **Login as Admin**: Use admin credentials to access `/admin`
4. **Register as Tutor**: Create a tutor account
5. **Assign Doubt**: In admin panel, assign a pending doubt to a tutor
6. **Solve Doubt**: Login as tutor and submit a solution

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify MONGODB_URI in `.env` file
- Check if MongoDB is listening on the correct port (default: 27017)

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port

### OCR Not Working
- Tesseract.js requires time to process images
- Large images may take longer
- Check browser console for errors

### CORS Errors
- Ensure backend CORS is configured correctly
- Check that frontend proxy is set in `frontend/package.json`

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or secure MongoDB instance
4. Set up proper file storage (Cloudinary/AWS S3)
5. Configure environment variables on hosting platform
6. Build frontend: `cd frontend && npm run build`
7. Serve frontend build with a web server or CDN
