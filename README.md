# DoubtiQ - AI-Powered Doubt Solving Platform

DoubtiQ is a comprehensive MERN stack application that helps students get instant solutions to their academic doubts through OCR, text matching, and tutor assistance.

## Features

### For Students
- **Upload Doubts**: Upload images or type text doubts
- **OCR Technology**: Automatic text extraction from images
- **Instant Matching**: AI-powered matching with existing solutions
- **Video Solutions**: YouTube video embeds for visual learning
- **Step-by-Step Solutions**: Detailed text solutions with steps
- **Dashboard**: Track all submitted doubts and their status
- **Free & Premium Plans**: 
  - Free users see ads and have limited features
  - Premium users get ad-free experience, unlimited doubts, and priority answers

### For Tutors
- **Assignment Management**: View and solve assigned doubts
- **Solution Upload**: Provide text or video solutions
- **YouTube Integration**: Earn from YouTube monetization
- **Performance Tracking**: Track solutions and views

### For Admins
- **Doubt Management**: View and assign doubts to tutors
- **Tutor Management**: Manage tutor accounts and status
- **User Management**: View all users and subscriptions
- **Ad Management**: Control advertisements on the platform
- **Analytics Dashboard**: View platform statistics

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **OCR**: Tesseract.js
- **Text Matching**: Natural language processing with Natural.js

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Doubtiq
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/doubtiq
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   
   From the root directory:
   ```bash
   npm run dev
   ```
   
   This will start both backend (port 5000) and frontend (port 3000) servers.

   Or run separately:
   ```bash
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

## Usage

1. **Register/Login**: Create an account as a student, tutor, or admin
2. **Upload Doubt**: Go to home page and upload an image or type your doubt
3. **Get Solution**: If a match is found, view the solution immediately
4. **Submit to Tutors**: If no match, submit the doubt to tutors
5. **View Dashboard**: Check your doubts and their solutions

### Admin Access
- Create an admin account manually in the database or modify the registration route
- Access admin panel at `/admin`

### Tutor Access
- Register as a tutor
- Wait for admin to assign doubts
- Access tutor panel at `/tutor`

## Project Structure

```
Doubtiq/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions (OCR, matching)
│   ├── uploads/         # Uploaded images
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── context/     # React context
│       └── App.js       # Main app component
└── package.json         # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Doubts
- `POST /api/doubts/upload` - Upload a doubt
- `POST /api/doubts/:id/submit` - Submit doubt to tutors
- `GET /api/doubts/my-doubts` - Get user's doubts
- `GET /api/doubts/:id` - Get single doubt

### Solutions
- `POST /api/solutions` - Create solution (tutor)
- `GET /api/solutions/:id` - Get solution

### Admin
- `GET /api/admin/doubts` - Get all doubts
- `PUT /api/admin/doubts/:id/assign` - Assign doubt to tutor
- `GET /api/admin/tutors` - Get all tutors
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get dashboard stats

### Subscriptions
- `POST /api/subscriptions/upgrade` - Upgrade to premium
- `GET /api/subscriptions/status` - Get subscription status

### Ads
- `GET /api/ads` - Get active ads
- `POST /api/ads` - Create ad (admin)
- `PUT /api/ads/:id` - Update ad (admin)
- `DELETE /api/ads/:id` - Delete ad (admin)

## Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/doubtiq
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Notes

- OCR processing may take some time for large images
- Text matching uses Jaccard similarity algorithm
- YouTube video IDs are extracted automatically from URLs
- Premium users don't see ads (implemented in frontend)
- File uploads are stored locally in `backend/uploads/`

## Future Enhancements

- Payment gateway integration for subscriptions
- Cloud storage for images (Cloudinary/AWS S3)
- Advanced AI matching algorithms
- Real-time notifications
- Email notifications
- Mobile app
- Advanced analytics

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
