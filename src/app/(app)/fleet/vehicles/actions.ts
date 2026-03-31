
'use server';

import { createVehicle, updateVehicle , deleteVehicle } from '@/services/vehicle-service';
import type { VehicleData } from '@/services/vehicle-service';
import { revalidatePath } from 'next/cache';

export async function createVehicleAction(data: VehicleData): Promise<{ success: boolean, error?: string, vehicleId?: string }> {
    try {
        const newVehicle = await createVehicle(data);
        revalidatePath('/fleet/vehicles');
        return { success: true, vehicleId: newVehicle.id };
    } catch(e: any) {
        let errorMessage = e.message || "An unknown error occurred.";
        if (String(e.message).includes('Firestore is not initialized')) {
             errorMessage = "A connection to the database could not be established. Please contact support if the issue persists.";
        }
        return { success: false, error: errorMessage };
    }
}

export async function updateVehicleAction(id: string, data: VehicleData): Promise<{ success: boolean, error?: string }> {
    try {
        await updateVehicle(id, data);
        revalidatePath('/fleet/vehicles');
        revalidatePath(`/fleet/vehicles/${id}`);
        return { success: true };
    } catch(e: any) {
        let errorMessage = e.message || "An unknown error occurred.";
        if (String(e.message).includes('Firestore is not initialized')) {
             errorMessage = "A connection to the database could not be established. Please contact support if the issue persists.";
        }
        return { success: false, error: errorMessage };
    }
}

export async function deleteVehicleAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { requirePermission } = await import('@/lib/tenant-auth');
    const { getTenantDB } = await import('@/lib/tenant-db');
    const user = await requirePermission('vehicles:delete');
    const tdb = getTenantDB(user.tenantId!);
    await tdb.delete('vehicles', id);
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/fleet/vehicles');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function bulkDeleteVehicleAction(
  ids: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { requirePermission } = await import('@/lib/tenant-auth');
    const { getTenantDB } = await import('@/lib/tenant-db');
    const user = await requirePermission('vehicles:delete');
    const tdb = getTenantDB(user.tenantId!);
    await Promise.all(ids.map((id) => tdb.delete('vehicles', id)));
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/fleet/vehicles');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
