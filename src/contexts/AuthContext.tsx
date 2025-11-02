// Auth Context for managing user authentication state
import { auth, googleProvider } from '@/lib/firebase';
import { User, authApi } from '@/services/api';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (authApi.isAuthenticated()) {
        console.log('Fetching user profile from backend...');
        const userData = await authApi.getProfile();
        console.log('User profile fetched successfully:', userData);
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // If there's an auth error, clear the token and redirect
      if (error instanceof Error && error.message.includes('401')) {
        authApi.clearAuthToken();
        setUser(null);
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      console.log(
        'Firebase auth state changed:',
        firebaseUser ? 'logged in' : 'logged out'
      );
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Get Firebase ID token and set it for API calls
          console.log('Getting Firebase ID token...');
          const token = await firebaseUser.getIdToken();
          console.log('Firebase ID token obtained, setting for API calls');
          authApi.setAuthToken(token);
          await refreshUser();
        } catch (error) {
          console.error(
            'Error getting Firebase token or refreshing user:',
            error
          );
          setUser(null);
        }
      } else {
        authApi.clearAuthToken();
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signupWithEmail = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      // Create user profile on backend
      authApi.setAuthToken(token);
      await authApi.updateProfile(userData);
      await refreshUser();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Use redirect to avoid CORS popup issues
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      authApi.clearAuthToken();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
