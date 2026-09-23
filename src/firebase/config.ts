import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDgNHg8GYjIditbCCjIzSWO_4PZLfRIn1g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "d-configurator-f02d8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "d-configurator-f02d8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "d-configurator-f02d8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1055257243684",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1055257243684:web:fd9f961c9a42abe7c668b1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-J9VKW6ZHZW"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

const isFirebaseConfigured = true;

export { app, auth, db, storage, analytics, isFirebaseConfigured };
