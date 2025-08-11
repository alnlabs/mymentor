// Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCntxt0sM3ycfH54lPPjvl6KUyFljCZIVg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "interview-platform-443f2.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "interview-platform-443f2",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "interview-platform-443f2.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "395858080619",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:395858080619:web:06eacc42f350898cd9d22e"
};
