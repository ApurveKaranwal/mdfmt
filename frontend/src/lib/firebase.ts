import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged,
    type User,
    type Auth,
} from 'firebase/auth';

// Firebase config — uses env vars from .env file
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
}

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const notConfiguredError = () => {
    const err: any = new Error('Firebase not configured');
    err.code = 'auth/configuration-not-found';
    return Promise.reject(err);
};

// Auth functions — fail gracefully if not configured
export const signInWithGoogle = () =>
    auth ? signInWithPopup(auth, googleProvider) : notConfiguredError();

export const signInWithGithub = () =>
    auth ? signInWithPopup(auth, githubProvider) : notConfiguredError();

export const signInWithEmail = (email: string, password: string) =>
    auth ? signInWithEmailAndPassword(auth, email, password) : notConfiguredError();

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!auth) return notConfiguredError();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    return cred;
};

export const logOut = () => (auth ? signOut(auth) : Promise.resolve());

export { auth, onAuthStateChanged, isConfigured, type User };
