import { ensureDbConnected } from '@/lib/firebase-admin';

export interface Commission {
  id?: string;
  organizationId: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  amount?: number;
  rate?: number;
  period?: string;
  status?: string;
  createdAt?: Date;
}

export async function getCommissions(organizationId: string): Promise<Commission[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('commissions').where('organizationId', '==', organizationId).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Commission));
}

export async function createCommission(data: Omit<Commission, 'id'>): Promise<Commission> {
  const db = await ensureDbConnected();
  const ref = await db.collection('commissions').add({ ...data, createdAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updateCommission(id: string, data: Partial<Commission>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('commissions').doc(id).update(data);
}
