import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export type TripType = 'round-trip' | 'one-way';

export type Trip = {
  id: string;
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
  startDate?: string; endDate?: string;
  customerId?: string; driverId?: string; status?: string;
};

export async function createTrip(data: Omit<Trip, 'id'>): Promise<Trip> {
  const ref = await db.collection('trips').add({ ...data, createdAt: Timestamp.now() });
  return { id: ref.id, ...data };
}

export async function updateTrip(id: string, data: Partial<Omit<Trip, 'id'>>): Promise<void> {
  await db.collection('trips').doc(id).update(data);
}

export async function getTripById(id: string): Promise<Trip | null> {
  const doc = await db.collection('trips').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Trip;
}

export async function getTrips(filters?: TripFilters): Promise<Trip[]> {
  let q: FirebaseFirestore.Query = db.collection('trips');
  if (filters?.customerId) q = q.where('customerId', '==', filters.customerId);
  if (filters?.driverId) q = q.where('driverId', '==', filters.driverId);
  if (filters?.status) q = q.where('status', '==', filters.status);
  if (filters?.startDate) q = q.where('date', '>=', filters.startDate);
  if (filters?.endDate) q = q.where('date', '<=', filters.endDate);
  q = q.orderBy('date', 'desc');
  const snap = await q.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Trip));
}

export async function deleteTrip(id: string): Promise<void> {
  await db.collection('trips').doc(id).delete();
}
