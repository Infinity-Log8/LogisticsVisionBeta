'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';
import { generateFuelId } from '@/lib/generate-id';

export interface FuelLog {
  fuelRef?: string; // Human-friendly reference (FUL-YYYYMMDD-XXXX)
  id?: string;
  organizationId: string;
  vehicleId?: string;
  driverId?: string;
  date?: Date;
  liters?: number;
  cost?: number;
  odometer?: number;
  station?: string;
  createdAt?: Date;
  kmDriven?: number;
  notes?: string;
}

export async function getFuelLogs(organizationId?: string): Promise<FuelLog[]> {
  if (!organizationId) return [];

  const db = await ensureDbConnected();
  const snap = await db.collection('fuel_logs').where("organizationId", "==", organizationId || "").orderBy('date', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as FuelLog));
}

export async function getFuelLogsByVehicle(vehicleId: string, organizationId: string): Promise<FuelLog[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('fuel_logs')
    .where("organizationId", "==", organizationId || "")
    .where('vehicleId', '==', vehicleId)
    .orderBy('date', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as FuelLog));
}

export async function createFuelLog(data: Omit<FuelLog, 'id'>): Promise<FuelLog> {
  const db = await ensureDbConnected();
  const fuelRef = generateFuelId();
    const ref = await db.collection('fuel_logs').add({
      fuelRef, ...data, createdAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updateFuelLog(id: string, data: Partial<FuelLog>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('fuel_logs').doc(id).update(data);
}

export async function deleteFuelLog(id: string): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('fuel_logs').doc(id).delete();
}
