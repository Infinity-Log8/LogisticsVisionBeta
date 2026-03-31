'use server';

import { ensureDbConnected } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

export async function createNoteAction(data: { title: string; content: string; category?: string }) {
  try {
    const db = await ensureDbConnected();
    await db!.collection('notes').add({
      ...data,
      createdAt: new Date().toISOString(),
    });
    revalidatePath('/notes');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteNoteAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await ensureDbConnected();
    await db!.collection('notes').doc(id).delete();
    revalidatePath('/notes');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getNotesAction() {
  const db = await ensureDbConnected();
  const snap = await db!.collection('notes').orderBy('createdAt', 'desc').get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}
