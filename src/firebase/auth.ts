import { auth, db } from './config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../store/authStore';
import { saveUserToFirestoreAndLocal } from './users';

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@apexgolf.com').toLowerCase();

// Ensure local persistence is configured on Firebase Auth instance
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} catch (e) {}

/**
 * Helper to fetch Firestore document with a fast 1-second timeout
 */
async function getDocWithTimeout(ref: any, timeoutMs = 1200): Promise<any> {
  return Promise.race([
    getDoc(ref),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore network timeout')), timeoutMs)
    )
  ]);
}

/**
 * Fetch user profile from Firestore with fallback to Auth profile
 */
export async function getUserProfileFromFirestore(firebaseUser: FirebaseUser): Promise<UserProfile> {
  const emailLower = (firebaseUser.email || '').toLowerCase();
  const isAdminByEmail = emailLower === ADMIN_EMAIL || emailLower.startsWith('admin');

  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDocWithTimeout(userRef, 1200);

    if (userSnap && userSnap.exists()) {
      const data = userSnap.data();
      const role: 'admin' | 'user' = data.role === 'admin' || isAdminByEmail ? 'admin' : 'user';
      const profile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: data.displayName || firebaseUser.displayName || emailLower.split('@')[0] || 'User',
        role
      };

      saveUserToFirestoreAndLocal(profile);
      return profile;
    }

    // Default profile if doc doesn't exist yet
    const defaultRole: 'admin' | 'user' = isAdminByEmail ? 'admin' : 'user';
    const newProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || emailLower.split('@')[0] || 'User',
      role: defaultRole
    };

    saveUserToFirestoreAndLocal(newProfile);
    return newProfile;
  } catch (err) {
    const fallbackProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || emailLower.split('@')[0] || 'User',
      role: isAdminByEmail ? 'admin' : 'user'
    };

    saveUserToFirestoreAndLocal(fallbackProfile);
    return fallbackProfile;
  }
}

/**
 * Log in with Email & Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  const profile = await getUserProfileFromFirestore(credential.user);
  await saveUserToFirestoreAndLocal(profile);
  return profile;
}

/**
 * Register new user with Email & Password
 */
export async function registerWithEmail(email: string, pass: string, name: string): Promise<UserProfile> {
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  
  if (name) {
    try {
      await updateProfile(credential.user, { displayName: name });
    } catch (e) {}
  }

  const emailLower = (credential.user.email || email).toLowerCase();
  const role: 'admin' | 'user' = emailLower === ADMIN_EMAIL || emailLower.startsWith('admin') ? 'admin' : 'user';

  const userProfile: UserProfile = {
    uid: credential.user.uid,
    email: credential.user.email || email,
    displayName: name || credential.user.email?.split('@')[0] || 'User',
    role
  };

  await saveUserToFirestoreAndLocal(userProfile);
  return userProfile;
}

/**
 * Sign out user explicitly
 */
export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Subscribe to Auth state changes and instantly sync user session
 */
export function subscribeToAuth(callback: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const emailLower = (firebaseUser.email || '').toLowerCase();
      const isAdmin = emailLower === ADMIN_EMAIL || emailLower.startsWith('admin');
      const immediateProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || emailLower.split('@')[0] || 'User',
        role: isAdmin ? 'admin' : 'user'
      };
      
      saveUserToFirestoreAndLocal(immediateProfile);
      callback(immediateProfile);

      try {
        const enriched = await getUserProfileFromFirestore(firebaseUser);
        saveUserToFirestoreAndLocal(enriched);
        callback(enriched);
      } catch (e) {}
    } else {
      callback(null);
    }
  });
}
