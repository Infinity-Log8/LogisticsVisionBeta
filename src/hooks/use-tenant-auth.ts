'use client';

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import type { TenantRole } from '@/lib/tenant-types';

// ─── Types ─────────────────────────────────────────────────────────────────

interface TenantClaims {
  tenantId: string | null;
  role: TenantRole | null;
  isAdmin: boolean;
  isOwner: boolean;
}

interface TenantAuthState {
  user: User | null;
  claims: TenantClaims;
  loading: boolean;
  error: string | null;
}

interface TenantAuthActions {
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
}

export type TenantAuth = TenantAuthState & TenantAuthActions;

// ─── Default claims ────────────────────────────────────────────────────────

const defaultClaims: TenantClaims = {
  tenantId: null,
  role: null,
  isAdmin: false,
  isOwner: false,
};

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useTenantAuth(): TenantAuth {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<TenantClaims>(defaultClaims);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractClaims = useCallback(async (firebaseUser: User): Promise<TenantClaims> => {
    const tokenResult = await firebaseUser.getIdTokenResult();
    const c = tokenResult.claims;
    return {
      tenantId: (c.tenantId as string) ?? null,
      role: (c.role as TenantRole) ?? null,
      isAdmin: c.isAdmin === true || c.role === 'admin' || c.role === 'owner',
      isOwner: c.isOwner === true || c.role === 'owner',
    };
  }, []);

  const persistSession = useCallback(async (firebaseUser: User) => {
    const idToken = await firebaseUser.getIdToken();
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userClaims = await extractClaims(firebaseUser);
        setUser(firebaseUser);
        setClaims(userClaims);
      } else {
        setUser(null);
        setClaims(defaultClaims);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [extractClaims]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await persistSession(cred.user);
        const userClaims = await extractClaims(cred.user);
        setClaims(userClaims);
      } catch (err: unknown) {
        setError(getAuthErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [persistSession, extractClaims]
  );

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await persistSession(cred.user);
      const userClaims = await extractClaims(cred.user);
      setClaims(userClaims);
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistSession, extractClaims]);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      setError(null);
      setLoading(true);
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await persistSession(cred.user);
      } catch (err: unknown) {
        setError(getAuthErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' });
    setUser(null);
    setClaims(defaultClaims);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const refreshToken = useCallback(async () => {
    if (!user) return;
    await user.getIdToken(true); // force refresh
    const userClaims = await extractClaims(user);
    setClaims(userClaims);
    await persistSession(user);
  }, [user, extractClaims, persistSession]);

  const switchTenant = useCallback(
    async (tenantId: string) => {
      if (!user) return;
      const idToken = await user.getIdToken();
      await fetch('/api/tenant/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ tenantId }),
      });
      // Force token refresh to pick up new claims
      await refreshToken();
    },
    [user, refreshToken]
  );

  return {
    user,
    claims,
    loading,
    error,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    refreshToken,
    switchTenant,
  };
}

// ─── Context ────────────────────────────────────────────────────────────────

import React from 'react';

const TenantAuthContext = createContext<TenantAuth | null>(null);

export function TenantAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useTenantAuth();
  return React.createElement(TenantAuthContext.Provider, { value: auth }, children);
}

export function useTenantAuthContext(): TenantAuth {
  const ctx = useContext(TenantAuthContext);
  if (!ctx) throw new Error('useTenantAuthContext must be used within TenantAuthProvider');
  return ctx;
}

// ─── Error helper ──────────────────────────────────────────────────────────

function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return 'An unexpected error occurred';
  const code = (error as { code?: string }).code ?? '';
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  };
  return errorMessages[code] ?? error.message;
}
