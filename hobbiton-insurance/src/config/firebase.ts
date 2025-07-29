import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { QuoteData } from '../types/index';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const signInUser = async (): Promise<User | null> => {
  try {
    // Check if Firebase is properly configured
    if (firebaseConfig.apiKey === "demo-key") {
      console.log('Firebase not configured - using demo mode');
      return { uid: 'demo-user-' + Date.now() } as User;
    }
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Error signing in:', error);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const saveQuote = async (quoteData: Omit<QuoteData, 'id'>): Promise<string | null> => {
  try {
    // Check if Firebase is properly configured
    if (firebaseConfig.apiKey === "demo-key") {
      console.log('Firebase not configured - saving to localStorage');
      const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
      const newQuote = { ...quoteData, id: 'demo-' + Date.now() };
      savedQuotes.push(newQuote);
      localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
      return newQuote.id;
    }
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...quoteData,
      timestamp: Timestamp.fromDate(quoteData.timestamp)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving quote:', error);
    return null;
  }
};

export const getSavedQuotes = async (userId: string): Promise<QuoteData[]> => {
  try {
    // Check if Firebase is properly configured
    if (firebaseConfig.apiKey === "demo-key") {
      console.log('Firebase not configured - loading from localStorage');
      const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
      return savedQuotes.filter((quote: QuoteData) => quote.userId === userId);
    }
    const q = query(
      collection(db, 'quotes'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as QuoteData[];
  } catch (error) {
    console.error('Error getting saved quotes:', error);
    return [];
  }
};

export { auth, db }; 