'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export type Organization = {
  id?: string;
  name: string;
  ownerId: string;
  ownerEmail?: string;
  createdAt?: string;
};

export async function createOrganization(name: string, ownerId: string, ownerEmail: string = ''): Promise<Organization> {
  const db = await ensureDbConnected();
  const ref = await db.collection('organizations').add({
    name,
    ownerId,
    ownerEmail,
    createdAt: Timestamp.now(),
  });
  // Store org reference in user doc
  await db.collection('users').doc(ownerId).set({ organizationId: ref.id, role: 'Owner', email: ownerEmail }, { merge: true });
  return { id: ref.id, name, ownerId, ownerEmail, createdAt: new Date().toISOString() };
}

export async function getOrganizationByUserId(userId: string): Promise<Organization | null> {
  const db = await ensureDbConnected();
  // First check user doc for organizationId
  const userDoc = await db.collection('users').doc(userId).get();
  if (!userDoc.exists) return null;
  const organizationId = userDoc.data()?.organizationId;
  if (!organizationId) return null;
  // Fetch org doc
  const orgDoc = await db.collection('organizations').doc(organizationId).get();
  if (!orgDoc.exists) return null;
  return { id: orgDoc.id, ...orgDoc.data() } as Organization;
}

export async function getOrganizationById(orgId: string): Promise<Organization | null> {
  const db = await ensureDbConnected();
  const doc = await db.collection('organizations').doc(orgId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Organization;
}

export async function getOrgMembers(orgId: string) {
  const db = await ensureDbConnected();
  const snap = await db.collection('users').where('organizationId', '==', orgId).get();
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}
