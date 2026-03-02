'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Mail, Link as LinkIcon, Trash2, Loader2, CheckCircle } from 'lucide-react';

interface Invite { id: string; email: string; role: string; token: string; status: string; }

export default function TeamPage() {
  const { user, organizationId, organizationName, userRole } = useAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const fetchData = async () => {
    if (!organizationId) return;
    try {
      const res = await fetch('/api/invites?organizationId=' + organizationId);
      const data = await res.json();
      setInvites(data.invites || []);
    } catch {}
  };

  useEffect(() => { fetchData(); }, [organizationId]);

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !user) return;
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, organizationId, invitedBy: user.email, role: inviteRole }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to send invite'); return; }
      setSuccess('Invite sent to ' + inviteEmail);
      setInviteEmail('');
      await fetchData();
    } catch { setError('Failed to send invite'); }
    finally { setLoading(false); }
  };

  const deleteInvite = async (id: string) => {
    try { await fetch('/api/invites?id=' + id, { method: 'DELETE' }); await fetchData(); } catch {}
  };

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(window.location.origin + '/join/' + token);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  const isOwner = userRole === 'Owner';

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" /> Team Management
        </h1>
        <p className="text-muted-foreground mt-1">
          {organizationName ? 'Managing ' + organizationName : 'Manage your organization members and invites'}
        </p>
      </div>

      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Invite a Team Member</CardTitle>
            <CardDescription>Send an invite link to add someone to your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={sendInvite} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
              </div>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Invite'}
              </Button>
            </form>
            {error && <Alert variant="destructive" className="mt-3"><AlertDescription>{error}</AlertDescription></Alert>}
            {success && <Alert className="mt-3 border-green-500"><AlertDescription className="text-green-600">{success}</AlertDescription></Alert>}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pending Invites</CardTitle>
          <CardDescription>{invites.length === 0 ? 'No pending invites' : invites.length + ' pending invite' + (invites.length !== 1 ? 's' : '')}</CardDescription>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No pending invites yet.</p>
          ) : (
            <div className="space-y-3">
              {invites.map(invite => (
                <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{invite.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{invite.role}</Badge>
                      <Badge variant="outline" className="text-xs">{invite.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Button variant="ghost" size="sm" onClick={() => copyLink(invite.token)}>
                      {copied === invite.token ? <CheckCircle className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
                    </Button>
                    {isOwner && (
                      <Button variant="ghost" size="sm" onClick={() => deleteInvite(invite.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}