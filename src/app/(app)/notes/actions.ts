'use server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export async function createNoteAction(data: { title: string; content: string; category?: string }) {
  try {
    await db.collection('notes').add({ ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
    revalidatePath('/notes');
    return { success: true };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteNoteAction(id: string) {
  try {
    await db.collection('notes').doc(id).delete();
    revalidatePath('/notes');
    return { success: true };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function getNotesAction() {
  const snap = await db.collection('notes').orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
}
