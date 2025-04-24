'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  updateEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Define User Preferences type
interface UserPreferences {
  notifications: boolean;
  darkMode: boolean;
}

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string; email?: string }) => Promise<void>;
  updateUserPreferences: (preferences: UserPreferences) => Promise<void>;
  getUserPreferences: () => Promise<UserPreferences | null>;
  error: string | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  updateUserPreferences: async () => {},
  getUserPreferences: async () => null,
  error: null
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps app and makes auth object available to any child component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Initialize user preferences in Firestore
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
          preferences: {
            notifications: true,
            darkMode: false
          }
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      throw error;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      throw error;
    }
  };
  
  // Update user profile
  const updateUserProfile = async (data: { displayName?: string; email?: string }) => {
    setError(null);
    try {
      if (!auth.currentUser) throw new Error('No user is logged in');
      
      // Update display name if provided
      if (data.displayName) {
        await updateProfile(auth.currentUser, { displayName: data.displayName });
      }
      
      // Update email if provided
      if (data.email && data.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, data.email);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      throw error;
    }
  };
  
  // Update user preferences in Firestore
  const updateUserPreferences = async (preferences: UserPreferences) => {
    setError(null);
    try {
      if (!auth.currentUser) throw new Error('No user is logged in');
      
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, { preferences }, { merge: true });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      throw error;
    }
  };
  
  // Get user preferences from Firestore
  const getUserPreferences = async (): Promise<UserPreferences | null> => {
    try {
      if (!auth.currentUser) return null;
      
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists() && docSnap.data().preferences) {
        return docSnap.data().preferences as UserPreferences;
      }
      
      // Default preferences if none exist
      return {
        notifications: true,
        darkMode: false
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    updateUserProfile,
    updateUserPreferences,
    getUserPreferences,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}