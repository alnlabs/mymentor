import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

// Firebase configuration
export const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyCntxt0sM3ycfH54lPPjvl6KUyFljCZIVg",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "interview-platform-443f2.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "interview-platform-443f2",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "interview-platform-443f2.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "395858080619",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:395858080619:web:06eacc42f350898cd9d22e",
};

console.log("Firebase config:", {
  apiKey: firebaseConfig.apiKey ? "Set" : "Not set",
  authDomain: firebaseConfig.authDomain ? "Set" : "Not set",
  projectId: firebaseConfig.projectId ? "Set" : "Not set",
  storageBucket: firebaseConfig.storageBucket ? "Set" : "Not set",
  messagingSenderId: firebaseConfig.messagingSenderId ? "Set" : "Not set",
  appId: firebaseConfig.appId ? "Set" : "Not set",
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
console.log("Firebase auth initialized:", auth);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    console.log("Attempting Google sign-in...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google sign-in successful:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    console.log("Attempting sign-out...");
    await firebaseSignOut(auth);
    console.log("Sign-out successful");
  } catch (error) {
    console.error("Sign-Out Error:", error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  console.log("Setting up auth state listener...");
  return onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed callback triggered:", user?.email);
    callback(user);
  });
};
