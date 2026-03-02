'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [inviteInfo, setInviteInfo] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    fetch(`/api/invites/verify?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setStatus('invalid'); return; }
        setInviteInfo(data);
        setStatus('valid');
      })
      .catch(() => setStatus('invalid'));
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Truck className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Logistics Vision</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            {status === 'valid' ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <CardTitle>You're Invited!</CardTitle>
                <CardDescription>
                  {inviteInfo
                    ? `Join as ${inviteInfo.role} — ${inviteInfo.email}`
                    : 'You have a valid invite'}
                </CardDescription>
              </>
            ) : (
              <>
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                <CardTitle>Invalid Invite</CardTitle>
                <CardDescription>This invite link is invalid or has expired.</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {status === 'valid' && (
              <>
                <Button className="w-full" onClick={() => router.push(`/register?invite=${token}`)}>
                  Create New Account & Join
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push(`/login?invite=${token}`)}>
                  Sign In with Existing Account
                </Button>
              </>
            )}
            {status === 'invalid' && (
              <Button variant="outline" className="w-full" onClick={() => router.push('/login')}>
                Go to Login
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
