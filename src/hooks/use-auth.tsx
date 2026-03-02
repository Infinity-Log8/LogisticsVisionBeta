'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  organizationId: string | null;
  organizationName: string | null;
  userRole: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  organizationId: null,
  organizationName: null,
  userRole: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => { throw new Error('Not implemented'); },
  signInWithGoogle: async () => { throw new Error('Not implemented'); },
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrg = async (uid: string) => {
    try {
      const res = await fetch(`/api/user/org?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setOrganizationId(data.organizationId ?? null);
        setOrganizationName(data.organizationName ?? null);
        setUserRole(data.role ?? null);
        // Set cookie so server components can access organizationId
        if (data.organizationId) {
          document.cookie = `orgId=${data.organizationId}; path=/; max-age=86400; SameSite=Lax`;
        }
      } else {
        setOrganizationId(null);
        setOrganizationName(null);
        setUserRole(null);
      }
    } catch {
      setOrganizationId(null);
      setOrganizationName(null);
      setUserRole(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchOrg(firebaseUser.uid);
      } else {
        setOrganizationId(null);
        setOrganizationName(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string): Promise<User> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const signInWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  const logOut = async () => {
    await signOut(auth);
    setOrganizationId(null);
    setOrganizationName(null);
    setUserRole(null);
    document.cookie = 'orgId=; path=/; max-age=0';
  };

  return (
    <AuthContext.Provider value={{ user, organizationId, organizationName, userRole, loading, signIn, signUp, signInWithGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
