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
  driverId?: string;
  driverName?: string;
  maintenanceDue?: string | Date;
  fuelEfficiency?: number;
  notes?: string;
}

export type VehicleData = Omit<Vehicle, 'id'>;

function toPlain(val) {
  if (!val) return null;
  if (typeof val.toDate === 'function') return val.toDate();
  return val;
}

export async function getVehicles(organizationId?: string): Promise<Vehicle[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('vehicles').get();
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      lastService: toPlain(data.lastService),
      createdAt: toPlain(data.createdAt),
      updatedAt: toPlain(data.updatedAt),
      maintenanceDue: toPlain(data.maintenanceDue),
    } as Vehicle;
  });
}

export async function getVehicleById(id: string, organizationId?: string): Promise<Vehicle | null> {
  const db = await ensureDbConnected();
  const doc = await db.collection('vehicles').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    lastService: toPlain(data.lastService),
    createdAt: toPlain(data.createdAt),
    updatedAt: toPlain(data.updatedAt),
    maintenanceDue: toPlain(data.maintenanceDue),
  } as Vehicle;
}

export async function createVehicle(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
  const db = await ensureDbConnected();
  // Generate sequential VEH-00001 style ID
  const snap = await db.collection('vehicles').get();
  let maxNum = 0;
  snap.docs.forEach(d => {
    const match = d.id.match(/^VEH-(\d+)$/);
    if (match) maxNum = Math.max(maxNum, parseInt(match[1]));
  });
  const newId = 'VEH-' + String(maxNum + 1).padStart(5, '0');
  await db.collection('vehicles').doc(newId).set({ ...data, createdAt: new Date(), updatedAt: new Date() });
  return { id: newId, ...data };
}

export async function updateVehicle(id: string, data: Partial<Vehicle>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('vehicles').doc(id).update({ ...data, updatedAt: new Date() });
}

export async function deleteVehicle(id: string): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('vehicles').doc(id).delete();
}
