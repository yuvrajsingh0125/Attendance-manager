// src/hooks/use-auth.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut, Auth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { AuthContextType } from '../types'; // <-- FIXED: Changed from '@/types' to '../types'

// Define the context with a default uninitialized value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides the Firebase Authentication state to the application.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Set up the listener for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as Auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);
  
  // Logout function
  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the Auth context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Component to protect routes, redirecting unauthenticated users to /login.
 */
export const ProtectedRoute: React.FC<{ element: ReactNode }> = ({ element }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if loading is complete AND there is no user
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    // Render a simple loading indicator while checking auth status
    return <div className="min-h-screen flex items-center justify-center text-xl text-primary">Authenticating...</div>;
  }

  return <>{element}</>;
};