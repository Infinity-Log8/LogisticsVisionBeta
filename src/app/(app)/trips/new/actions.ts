'use server';

import { createTrip } from '@/services/trip-service';
import type { Trip } from '@/services/trip-service';
import { revalidatePath } from 'next/cache';

type CreateTripInput = Omit<Trip, 'id'>;

export async function createTripAction(data: CreateTripInput): Promise<{ success: boolean; error?: string }> {
  try {
    await createTrip(data);
    revalidatePath('/trips');
    return { success: true };
  } catch (error: any) {
    console.error('createTripAction error:', error);
    return { success: false, error: error?.message || 'Failed to create trip.' };
  }
}
