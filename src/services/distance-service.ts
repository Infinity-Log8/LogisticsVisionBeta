import { ensureDbConnected } from '@/lib/firebase-admin';

export interface DistanceRecord {
  id?: string;
  organizationId: string;
  vehicleId?: string;
  driverId?: string;
  tripId?: string;
  distance?: number;
  unit?: string;
  date?: Date;
  createdAt?: Date;
}

export async function getDistanceRecords(organizationId: string): Promise<DistanceRecord[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('distance_records').where('organizationId', '==', organizationId).orderBy('date', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DistanceRecord));
}

export async function createDistanceRecord(data: Omit<DistanceRecord, 'id'>): Promise<DistanceRecord> {
  const db = await ensureDbConnected();
  const ref = await db.collection('distance_records').add({ ...data, createdAt: new Date() });
  return { id: ref.id, ...data };
}
