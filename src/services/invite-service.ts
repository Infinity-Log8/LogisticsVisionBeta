'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { randomBytes } from 'crypto';

export type Invite = {
  id: string;
  email: string;
  organizationId: string;
  invitedBy: string;
  role: 'Admin' | 'User';
  status: 'pending' | 'accepted' | 'expired';
  token: string;
  createdAt: string;
  expiresAt: string;
};

export async function createInvite(
  email: string,
  organizationId: string,
  invitedBy: string,
  role: 'Admin' | 'User' = 'User'
): Promise<Invite> {
  const db = ensureDbConnected();
  const token = randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const ref = await db.collection('invites').add({
    email: email.toLowerCase().trim(),
    organizationId,
    invitedBy,
    role,
    status: 'pending',
    token,
    createdAt: Timestamp.now(),
    expiresAt: Timestamp.fromDate(expiresAt),
  });
  return {
    id: ref.id, email, organizationId, invitedBy, role,
    status: 'pending', token,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export async function getInviteByToken(token: string): Promise<Invite | null> {
  const db = ensureDbConnected();
  const snap = await db.collection('invites').where('token', '==', token).where('status', '==', 'pending').limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  const data = doc.data();
  const expiresAt = data.expiresAt?.toDate?.() || new Date(0);
  if (expiresAt < new Date()) return null; // expired
  return { id: doc.id, ...data, createdAt: data.createdAt?.toDate?.()?.toISOString?.() || '', expiresAt: expiresAt.toISOString() } as Invite;
}

export async function acceptInvite(token: string, userId: string): Promise<string | null> {
  const db = ensureDbConnected();
  const invite = await getInviteByToken(token);
  if (!invite) return null;
  await db.collection('invites').doc(invite.id).update({ status: 'accepted' });
  await db.collection('users').doc(userId).set({
    organizationId: invite.organizationId,
    role: invite.role,
  }, { merge: true });
  return invite.organizationId;
}

export async function getInvitesByOrg(organizationId: string): Promise<Invite[]> {
  const db = ensureDbConnected();
  const snap = await db.collection('invites').where('organizationId', '==', organizationId).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id, ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() || '',
      expiresAt: data.expiresAt?.toDate?.()?.toISOString?.() || '',
    } as Invite;
  });
}

export async function deleteInvite(id: string): Promise<void> {
  const db = ensureDbConnected();
  await db.collection('invites').doc(id).delete();
}
