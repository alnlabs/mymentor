# Technical Interview Platform - Firebase Setup Guide

## Quick Setup (5 minutes)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "interview-platform"
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" provider
5. Add your email as authorized domain
6. Click "Save"

### 3. Get Firebase Config

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Register app with name: "interview-platform-web"
5. Copy the config object

### 4. Update Environment Variables

Copy the Firebase config to your `.env` file:

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Environment
NODE_ENV="development"
```

### 5. Install Dependencies & Start

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Features

- ✅ **Firebase Authentication** - Google sign-in with popup
- ✅ **Coding Problems** - Monaco editor with test execution
- ✅ **MCQ Questions** - Interactive quiz interface
- ✅ **Admin Panel** - JSON upload for content management
- ✅ **Progress Tracking** - User progress saved to database
- ✅ **Real-time Updates** - Instant feedback and results

## Firebase Benefits

- 🚀 **5-minute setup** - Much faster than Google Console
- 🎨 **Built-in UI** - Professional authentication interface
- 🔒 **Secure** - Google-grade security
- 📱 **Responsive** - Works on all devices
- 🔄 **Real-time** - Live updates and sync
- 🚀 **Scalable** - Handles growth automatically

## API Endpoints

- `GET /api/problems` - List all problems
- `GET /api/problems/[id]` - Get problem details
- `GET /api/mcq` - List all MCQ questions
- `GET /api/mcq/[id]` - Get MCQ details
- `POST /api/submissions` - Submit code solution
- `POST /api/admin/upload` - Upload content (admin only)

## Admin Usage

1. Sign in with Google
2. Visit `/admin`
3. Select content type (Problems or MCQ)
4. Paste JSON data or load sample
5. Click Upload

## Sample JSON Format

### Problems
```json
[
  {
    "id": "two-sum",
    "title": "Two Sum",
    "description": "Find two numbers that add up to target",
    "difficulty": "easy",
    "category": "arrays",
    "testCases": "[{\"input\": \"[2,7,11,15], 9\", \"output\": \"[0,1]\"}]",
    "solution": "Use hash map approach",
    "hints": "[\"Try using a hash map\"]",
    "tags": "[\"arrays\", \"hash-table\"]",
    "companies": "[\"Google\", \"Amazon\"]"
  }
]
```

### MCQ Questions
```json
[
  {
    "id": "binary-search",
    "question": "What is time complexity of binary search?",
    "options": "[\"O(n)\", \"O(log n)\", \"O(n²)\"]",
    "correctAnswer": 1,
    "explanation": "Binary search divides search space in half",
    "category": "algorithms",
    "difficulty": "easy",
    "tags": "[\"binary-search\", \"complexity\"]",
    "companies": "[\"Google\", \"Amazon\"]"
  }
]
```

## Next Steps

1. **Deploy to Firebase Hosting** - One command deployment
2. **Add Firestore Database** - Real-time data sync
3. **Add Analytics** - Track user engagement
4. **Add Email Notifications** - User progress updates
5. **Add More Auth Providers** - GitHub, Email, etc.
