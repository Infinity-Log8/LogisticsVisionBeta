'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';

export interface Quote {
  id?: string;
  organizationId: string;
  customerId?: string;
  customerName?: string;
  amount?: number;
  status?: string;
  validUntil?: Date;
  items?: any[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getQuotes(organizationId: string): Promise<Quote[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('quotes').where('organizationId', '==', organizationId).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Quote));
}

export async function getQuoteById(id: string, organizationId: string): Promise<Quote | null> {
  const db = await ensureDbConnected();
  const doc = await db.collection('quotes').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as Quote;
  if (data.organizationId !== organizationId) return null;
  return { id: doc.id, ...data };
}

export async function createQuote(data: Omit<Quote, 'id'>): Promise<Quote> {
  const db = await ensureDbConnected();
  const ref = await db.collection('quotes').add({ ...data, createdAt: new Date(), updatedAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updateQuote(id: string, data: Partial<Quote>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('quotes').doc(id).update({ ...data, updatedAt: new Date() });
}

export async function deleteQuote(id: string): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('quotes').doc(id).delete();
}
