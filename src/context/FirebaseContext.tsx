import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, User, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration should match exactly what's in the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDqTPjFLk6QV81M_RarhQZgURW9o4cz59o",
  authDomain: "imageediting-352df.firebaseapp.com",
  projectId: "imageediting-352df",
  storageBucket: "imageediting-352df.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "619949434824",
  appId: "1:619949434824:web:96f3878e05d4b7a7d782fd",
  measurementId: "G-VS1GKQS8EM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// For local development debugging if needed
// if (process.env.NODE_ENV === 'development') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

interface FirebaseContextType {
  auth: typeof auth;
  db: typeof db;
  storage: typeof storage;
  currentUser: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  auth,
  db,
  storage,
  currentUser: null,
  loading: true
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up Firebase auth listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "User logged out");
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    auth,
    db,
    storage,
    currentUser,
    loading
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};