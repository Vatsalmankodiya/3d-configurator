import { db } from './config';
import { collection, getDocs, doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../store/authStore';

const USERS_DIRECTORY_KEY = 'apexgolf_user_directory';

/**
 * Save user profile to both Firestore DB 'users' collection and local directory
 */
export async function saveUserToFirestoreAndLocal(user: UserProfile): Promise<void> {
  if (!user || !user.uid) return;

  // 1. Cache in local directory
  try {
    const cached = localStorage.getItem(USERS_DIRECTORY_KEY);
    const users: UserProfile[] = cached ? JSON.parse(cached) : [];
    const filtered = users.filter(u => u.uid !== user.uid && u.email !== user.email);
    localStorage.setItem(USERS_DIRECTORY_KEY, JSON.stringify([user, ...filtered]));
  } catch (e) {}

  // 2. Persist to Firestore DB 'users' collection
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err: any) {
    console.warn('Firestore user write warning (Check Firestore Security Rules if offline):', err);
  }
}

/**
 * Fetch all registered users from Firestore 'users' collection merged with local directory
 */
export async function fetchAllUsersFromFirestore(): Promise<UserProfile[]> {
  const localUsers: UserProfile[] = (() => {
    try {
      const cached = localStorage.getItem(USERS_DIRECTORY_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  })();

  const userMap = new Map<string, UserProfile>();
  localUsers.forEach(u => userMap.set(u.uid, u));

  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const userObj: UserProfile = {
        uid: docSnap.id,
        email: data.email || '',
        displayName: data.displayName || data.name || data.email?.split('@')[0] || 'User',
        role: data.role === 'admin' ? 'admin' : 'user'
      };
      userMap.set(docSnap.id, userObj);
    });

    const combined = Array.from(userMap.values());
    try {
      localStorage.setItem(USERS_DIRECTORY_KEY, JSON.stringify(combined));
    } catch (e) {}

    return combined;
  } catch (err) {
    console.warn('Could not fetch users from Firestore:', err);
    return Array.from(userMap.values());
  }
}

/**
 * Subscribe to real-time updates from Firestore 'users' collection
 */
export function subscribeToUsersCollection(callback: (users: UserProfile[]) => void) {
  const localUsers: UserProfile[] = (() => {
    try {
      const cached = localStorage.getItem(USERS_DIRECTORY_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  })();

  const userMap = new Map<string, UserProfile>();
  localUsers.forEach(u => userMap.set(u.uid, u));

  try {
    return onSnapshot(collection(db, 'users'), (snapshot) => {
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const userObj: UserProfile = {
          uid: docSnap.id,
          email: data.email || '',
          displayName: data.displayName || data.name || data.email?.split('@')[0] || 'User',
          role: data.role === 'admin' ? 'admin' : 'user'
        };
        userMap.set(docSnap.id, userObj);
      });

      const updated = Array.from(userMap.values());
      try {
        localStorage.setItem(USERS_DIRECTORY_KEY, JSON.stringify(updated));
      } catch (e) {}

      callback(updated);
    }, (error) => {
      console.warn('Firestore snapshot listener warning:', error);
      callback(Array.from(userMap.values()));
    });
  } catch (e) {
    callback(Array.from(userMap.values()));
    return () => {};
  }
}
