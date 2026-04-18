import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, loginWithGoogle, logout as firebaseLogout } from '../lib/firebase';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // In a real app, you might fetch "isAdmin" from custom claims or an "admins" collection.
        // For this bootstrapped app, we check the hardcoded admin email here too to reflect UI state.
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          isAdmin: firebaseUser.email === '1109anilchauhan@gmail.com'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return { user, loading, login, logout };
}
