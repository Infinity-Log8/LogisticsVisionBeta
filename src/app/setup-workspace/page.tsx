'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function SetupWorkspacePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to login only once auth is confirmed as not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !companyName.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email || '',
          companyName: companyName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create workspace');
      }

      // Set the orgId cookie so useAuth picks it up
      document.cookie = `orgId=${data.organizationId}; path=/; max-age=${60 * 60 * 24 * 30}`;

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-4">
            <Building2 className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Your Workspace</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Set up your company to start using Logistics Vision
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          {/* User info or loading */}
          {authLoading ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border mb-6">
              <Loader2 className="h-5 w-5 animate-spin text-orange-500 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">Loading your account...</p>
            </div>
          ) : user?.email ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border mb-6">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-orange-500 text-sm font-semibold">
                  {user.email[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="companyName"
                className="text-sm font-medium text-foreground block"
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Acme Logistics Inc."
                required
                disabled={isLoading || authLoading}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || authLoading || !companyName.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating workspace...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Create Workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            Have an invite link?{' '}
            <Link href="/join" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Join an existing workspace
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
