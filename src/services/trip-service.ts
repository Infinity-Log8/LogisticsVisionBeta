'use server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { generateTripId } from '@/lib/generate-id';

export type TripType = 'round-trip' | 'one-way';

export type Trip = {
  id: string;
  tripRef?: string; // Human-friendly trip reference (TRP-YYYYMMDD-XXXX)
  organizationId: string;
  customer: string;
  customerId: string;
  origin: string;
  destination: string;
  driver: string;
  driverId: string;
  date: string;
  status: 'Planned' | 'In Transit' | 'Delivered' | 'Cancelled' | 'Pending';
  pickupTime: string;
  estimatedDelivery: string;
  data?: string;
  vehicleId: string;
  distance: number;
  revenue: number;
  notes?: string;
  truck: string;
  tripType: TripType;
  brokerRef?: string;
  hiredTransportation?: boolean;
  loadRateCost: number;
  messDistanceCost: number;
  tireCost: number;
  fuelCost: number;
  driverOTCost: number;
};

export type TripFilters = {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  driverId?: string;
  status?: string;
};

export async function createTrip(data: Omit<Trip, 'id'>): Promise<Trip> {
  const tripRef = generateTripId();
    const ref = await db!.collection('trips').add({
      tripRef, ...data, createdAt: Timestamp.now() });
  return { id: ref.id, ...data };
}

export async function updateTrip(id: string, data: Partial<Omit<Trip, 'id'>>): Promise<void> {
  await db!.collection('trips').doc(id).update(data);
}

export async function getTripById(id: string, organizationId?: string): Promise<Trip | null> {
  try {
    const doc = await db!.collection('trips').doc(id).get();
    if (!doc.exists) return null;
    const trip = { id: doc.id, ...doc.data() } as Trip;
    if (organizationId && trip.organizationId !== organizationId) return null;
    return trip;
  } catch (err) {
    console.error('getTripById error:', err);
    return null;
  }
}

export async function getTrips(organizationId?: string, filters?: TripFilters): Promise<Trip[]> {
  // Allow fetching all trips when no orgId (dev mode)

  let q: FirebaseFirestore.Query = db!.collection('trips'); if (organizationId) q = (q as any).where("organizationId", "==", organizationId);
  if (filters?.customerId) q = q.where('customerId', '==', filters.customerId);
  if (filters?.driverId) q = q.where('driverId', '==', filters.driverId);
  if (filters?.status) q = q.where('status', '==', filters.status);
  if (filters?.startDate) q = q.where('date', '>=', filters.startDate);
  if (filters?.endDate) q = q.where('date', '<=', filters.endDate);
  q = q.orderBy('date', 'desc');
  const snap = await q.get().catch((err: any) => {
    if (err.code === 5 || err.message?.includes('NOT_FOUND') || err.message?.includes('index')) return null;
    console.error("Firestore error in trip-service.ts:", err?.message || err);
    return null;
  });
  if (!snap) return [];
  return snap.docs.map(d => { const data = d.data(); if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate().toISOString(); return { id: d.id, ...data } as Trip; });
}

export async function deleteTrip(id: string): Promise<void> {
  await db!.collection('trips').doc(id).delete();
}
