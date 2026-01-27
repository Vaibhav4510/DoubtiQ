# Quick Start Guide - DoubtiQ

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Setup Environment
Create `backend/.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/doubtiq
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Setup Admin User
```bash
cd backend
node scripts/setupAdmin.js
```

**Admin Credentials:**
- Email: `admin@gmail.com`
- Password: `Admin123`

### 4. Start MongoDB
Make sure MongoDB is running on your system.

### 5. Start the Application
```bash
npm run dev
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 📋 User Flow

### For Students:
1. Register/Login as a user
2. Go to Dashboard
3. Upload doubt (image or text)
4. System matches with existing solutions
5. If match found → See solution immediately
6. If no match → Submit to tutors
7. View solutions in dashboard

### For Tutors:
1. Register/Login as tutor
2. Wait for admin to assign doubts
3. Go to Tutor Panel
4. View assigned doubts
5. Submit solutions (text or YouTube video)
6. Edit solutions if needed

### For Admins:
1. Login: `admin@gmail.com` / `Admin123`
2. Go to Admin Panel
3. View all doubts
4. Verify pending doubts
5. Assign verified doubts to tutors
6. Manage tutors, users, and ads

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`

### Port Already in Use
- Change PORT in `.env`
- Or kill process using the port

### Admin Login Not Working
- Run: `cd backend && node scripts/setupAdmin.js`

### OCR Not Working
- Tesseract.js may take time for large images
- Check browser console for errors

## ✨ Features

- ✅ OCR Text Extraction
- ✅ Automatic Doubt Matching
- ✅ Step-by-Step Solutions
- ✅ YouTube Video Solutions
- ✅ Admin Verification Workflow
- ✅ Tutor Assignment System
- ✅ Beautiful Animations (Framer Motion)
- ✅ Responsive Design
- ✅ Role-Based Access Control

## 🎯 Key Routes

- `/` - Home page
- `/login` - Login
- `/register` - Register
- `/dashboard` - User Dashboard (for users)
- `/admin` - Admin Panel
- `/tutor` - Tutor Panel

Enjoy using DoubtiQ! 🎓
