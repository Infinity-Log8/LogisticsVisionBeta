'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';

export interface Vehicle {
  id?: string;
  organizationId: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  status?: string;
  type?: string;
  mileage?: number;
  lastService?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getVehicles(organizationId?: string): Promise<Vehicle[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('vehicles').where("organizationId", "==", organizationId || "").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle));
}

export async function getVehicleById(id: string, organizationId: string): Promise<Vehicle | null> {
  const db = await ensureDbConnected();
  const doc = await db.collection('vehicles').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as Vehicle;
  if (data.organizationId !== organizationId) return null;
  return { id: doc.id, ...data };
}

export async function createVehicle(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
  const db = await ensureDbConnected();
  const ref = await db.collection('vehicles').add({ ...data, createdAt: new Date(), updatedAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updateVehicle(id: string, data: Partial<Vehicle>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('vehicles').doc(id).update({ ...data, updatedAt: new Date() });
}

export async function deleteVehicle(id: string): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('vehicles').doc(id).delete();
}
