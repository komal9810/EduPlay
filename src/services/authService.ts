import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { createUserProfile, getUserProfile } from './firestoreService';
import { UserProfile } from '../types';

export interface AuthSessionUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isDemo?: boolean;
}

// Active demo student state (in case anonymous/password auth providers are disabled in Firebase Console)
let activeDemoSession: AuthSessionUser | null = null;
const authListeners: ((user: AuthSessionUser | null) => void)[] = [];

function notifyAuthListeners(user: AuthSessionUser | null) {
  authListeners.forEach(listener => {
    try {
      listener(user);
    } catch (e) {
      console.error('Auth listener error:', e);
    }
  });
}

export function isGoogleAuthSupportedOnCurrentDomain(): boolean {
  if (typeof window === 'undefined') return true;
  const host = window.location.hostname;
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.includes('run.app') ||
    host.includes('firebaseapp.com') ||
    host.includes('web.app')
  );
}

export function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials or create a new student account.';
    case 'auth/operation-not-allowed':
      return 'Email/Password authentication is disabled in Firebase Console. Please use Instant Demo Student mode.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing authentication.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/unauthorized-domain': {
      return 'Google Sign-In is restricted on this Vercel domain by the AI Studio Starter tier. Please use Email/Password sign-in or click "Instant Demo Student" to log in immediately!';
    }
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

// Sign up with Email/Password
export async function signUpWithEmail(name: string, email: string, pass: string): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;

  const newProfile: UserProfile = {
    uid: fbUser.uid,
    name: name.trim(),
    email: fbUser.email || email,
    level: 1,
    xp: 0,
    streak: 1,
    completedLessons: 0,
    gamesPlayed: 0,
    quizAccuracy: 0
  };

  await createUserProfile(newProfile);
  return newProfile;
}

// Log in with Email/Password
export async function logInWithEmail(email: string, pass: string): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;

  let profile = await getUserProfile(fbUser.uid);
  if (!profile) {
    profile = {
      uid: fbUser.uid,
      name: fbUser.displayName || email.split('@')[0],
      email: fbUser.email || email,
      level: 1,
      xp: 0,
      streak: 1,
      completedLessons: 0,
      gamesPlayed: 0,
      quizAccuracy: 0
    };
    await createUserProfile(profile);
  }

  return profile;
}

// Sign in with Google
export async function signInWithGoogle(): Promise<UserProfile> {
  if (!isGoogleAuthSupportedOnCurrentDomain()) {
    throw {
      code: 'auth/unauthorized-domain',
      message: 'Google Sign-In is restricted to the development/AI Studio domain on the Starter tier. Please use Email/Password or Instant Demo Student mode on Vercel.'
    };
  }
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const fbUser = userCredential.user;

  let profile = await getUserProfile(fbUser.uid);
  if (!profile) {
    profile = {
      uid: fbUser.uid,
      name: fbUser.displayName || 'Student',
      email: fbUser.email || '',
      level: 1,
      xp: 0,
      streak: 1,
      completedLessons: 0,
      gamesPlayed: 0,
      quizAccuracy: 0
    };
    await createUserProfile(profile);
  }

  return profile;
}

// Demo student login (Komal) - creates or loads demo profile
export async function loginAsDemoStudent(prefillKomal: boolean = true): Promise<UserProfile> {
  let uid = 'demo_komal_student';

  // 1. Try Firebase Anonymous auth if supported
  try {
    const cred = await signInAnonymously(auth);
    if (cred.user) {
      uid = cred.user.uid;
    }
  } catch (err) {
    console.info('Anonymous auth note (using demo student session):', err);
  }

  let profile = await getUserProfile(uid);
  if (!profile) {
    profile = {
      uid,
      name: prefillKomal ? 'Komal' : 'Demo Student',
      email: prefillKomal ? 'student@example.com' : 'demo@unitylearn.edu',
      level: 1,
      xp: 0,
      streak: 1,
      completedLessons: 0,
      gamesPlayed: 0,
      quizAccuracy: 0
    };
    await createUserProfile(profile);
  }

  // Set active demo session and notify listeners
  activeDemoSession = {
    uid,
    email: profile.email,
    displayName: profile.name,
    isDemo: true
  };
  notifyAuthListeners(activeDemoSession);

  return profile;
}

// Log out
export async function logOut(): Promise<void> {
  activeDemoSession = null;
  notifyAuthListeners(null);
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('SignOut note:', err);
  }
}

// Auth State observer that handles both Firebase Auth and Demo sessions
export function subscribeToAuthChanges(callback: (user: AuthSessionUser | null) => void) {
  authListeners.push(callback);

  // If there is an active demo session, trigger immediately
  if (activeDemoSession) {
    callback(activeDemoSession);
  }

  const unsubscribeFirebase = onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      activeDemoSession = null;
      callback({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        isDemo: false
      });
    } else if (!activeDemoSession) {
      callback(null);
    }
  });

  return () => {
    const index = authListeners.indexOf(callback);
    if (index > -1) {
      authListeners.splice(index, 1);
    }
    unsubscribeFirebase();
  };
}
