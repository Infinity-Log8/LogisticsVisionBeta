'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';

export interface Expense {
  id?: string;
  organizationId: string;
  category?: string;
  amount?: number;
  description?: string;
  date?: Date;
  vendor?: string;
  receiptUrl?: string;
  status?: string;
  paidBy?: string;
  tripId?: string | null;
  notes?: string;
  hasAttachment?: boolean;
  attachmentPath?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ExpenseData = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
export type ExpenseWithUrl = Expense & { receiptUrl?: string; attachmentUrl?: string };

export async function getExpenses(organizationId?: string): Promise<Expense[]> {
  if (!organizationId) return [];

  const db = await ensureDbConnected();
  const query = organizationId
    ? db.collection('expenses').where('organizationId', '==', organizationId).orderBy('date', 'desc')
    : db.collection('expenses').orderBy('date', 'desc');
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Expense));
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const db = await ensureDbConnected();
  const doc = await db.collection('expenses').doc(id).get();
  return { id: doc.id, ...doc.data() } as Expense;
}

export async function createExpense(data: Omit<Expense, 'id'>): Promise<Expense> {
  const db = await ensureDbConnected();
  const ref = await db.collection('expenses').add({ ...data, createdAt: new Date(), updatedAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updateExpense(id: string, data: Partial<Expense>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('expenses').doc(id).update({ ...data, updatedAt: new Date() });
}

export async function deleteExpense(id: string): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('expenses').doc(id).delete();
}
