'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';

export interface Payout {
  id?: string;
  organizationId: string;
  driverId?: string;
  driverName?: string;
  amount?: number;
  period?: string;
  status?: string;
  paidAt?: Date;
  createdAt?: Date;
  totalAmount?: number;
  payoutDate?: Date | string;
  commissionsCount?: number;
  commissionIds?: string[];
  notes?: string;
}

export async function getPayouts(organizationId: string): Promise<Payout[]> {
  if (!organizationId) return [];

  const db = await ensureDbConnected();
  const snap = await db.collection('payouts').where('organizationId', '==', organizationId).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Payout));
}

export async function createPayout(data: Omit<Payout, 'id'>): Promise<Payout> {
  const db = await ensureDbConnected();
  const ref = await db.collection('payouts').add({ ...data, createdAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updatePayout(id: string, data: Partial<Payout>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('payouts').doc(id).update(data);
}
