// firebase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
    getAuth,
    getReactNativePersistence,
    initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDI7Q6M9JNMxTQ_4ZmPZ3C9fQAqMQucsG4",
  authDomain: "family-app-b2339.firebaseapp.com",
  projectId: "family-app-b2339",
  storageBucket: "family-app-b2339.firebasestorage.app",
  messagingSenderId: "172693739294",
  appId: "1:172693739294:android:e98021c73681fe32ac1b0f"
};

// 1. Initialize Firebase App (only if not already done)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Auth with a "singleton" pattern to prevent already-initialized errors
let auth;
if (getApps().length > 0) {
  // If app was already initialized, get the existing auth instance
  auth = getAuth(app);
} else {
  // If this is the first time, initialize with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export const db = getFirestore(app);
export { auth };
export default app;