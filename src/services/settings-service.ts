'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';

export interface OrgSettings {
  id?: string;
  organizationId: string;
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  logoUrl?: string;
  currency?: string;
  timezone?: string;
  updatedAt?: Date;
}

export async function getSettings(organizationId: string): Promise<OrgSettings | null> {
  const db = await ensureDbConnected();
  const snap = await db.collection('settings').where('organizationId', '==', organizationId).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as OrgSettings;
}

export async function upsertSettings(organizationId: string, data: Partial<OrgSettings>): Promise<void> {
  const db = await ensureDbConnected();
  const snap = await db.collection('settings').where('organizationId', '==', organizationId).limit(1).get();
  if (snap.empty) {
    await db.collection('settings').add({ organizationId, ...data, updatedAt: new Date() });
  } else {
    await snap.docs[0].ref.update({ ...data, updatedAt: new Date() });
  }
}
