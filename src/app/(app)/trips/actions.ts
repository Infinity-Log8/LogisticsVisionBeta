
'use server';

import {
  createTrip,
  updateTrip,
  getTripById,

  type Trip,
  deleteTrip } from '@/services/trip-service';
import { revalidatePath } from 'next/cache';

export async function createTripAction(
  data: Omit<Trip, 'id'>
): Promise<{ success: boolean; error?: string; tripId?: string }> {
  try {
    const newTrip = await createTrip(data);
    revalidatePath('/trips');
    revalidatePath('/dashboard');
    return { success: true, tripId: newTrip.id };
  } catch (e: any) {
    let errorMessage = e.message || 'An unknown error occurred.';
    if (String(e.message).includes('Firestore is not initialized')) {
      errorMessage = "A connection to the database could not be established. Please contact support if the issue persists.";
    }
    return { success: false, error: errorMessage };
  }
}

export async function updateTripAction(
  id: string,
  data: Partial<Trip>
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateTrip(id, data);
    revalidatePath('/trips');
    revalidatePath(`/trips/${id}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e: any) {
    let errorMessage = e.message || 'An unknown error occurred.';
    if (String(e.message).includes('Firestore is not initialized')) {
      errorMessage = "A connection to the database could not be established. Please contact support if the issue persists.";
    }
    return { success: false, error: errorMessage };
  }
}

export async function cancelTripAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // We could add more complex business logic here, e.g., check if trip is in a cancelable state.
    await updateTrip(id, { status: 'Cancelled' });
    revalidatePath('/trips');
    revalidatePath(`/trips/${id}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e: any) {
    let errorMessage = e.message || 'An unknown error occurred.';
    if (String(e.message).includes('Firestore is not initialized')) {
      errorMessage = "A connection to the database could not be established. Please contact support if the issue persists.";
    }
    return { success: false, error: errorMessage };
  }
}

export async function getTripByIdAction(id: string): Promise<Trip | null> {
    return getTripById(id);
}

export async function completeTripAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateTrip(id, { status: 'Delivered' });
    revalidatePath('/trips');
    revalidatePath(`/trips/${id}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e: any) {
    let errorMessage = e.message || 'An unknown error occurred.';
    if (String(e.message).includes('Firestore is not initialized')) {
      errorMessage = "A connection to the database could not be established. Please contact support if the issue persists.";
    }
    return { success: false, error: errorMessage };
  }
}

export async function deleteTripAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { requirePermission } = await import('@/lib/tenant-auth');
    const { getTenantDB } = await import('@/lib/tenant-db');
    const user = await requirePermission('trips:delete');
    const tdb = getTenantDB(user.tenantId!);
    await tdb.delete('trips', id);
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/trips');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function bulkDeleteTripAction(
  ids: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { requirePermission } = await import('@/lib/tenant-auth');
    const { getTenantDB } = await import('@/lib/tenant-db');
    const user = await requirePermission('trips:delete');
    const tdb = getTenantDB(user.tenantId!);
    await Promise.all(ids.map((id) => tdb.delete('trips', id)));
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/trips');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
