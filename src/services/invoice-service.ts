import { ensureDbConnected } from '@/lib/firebase-admin';

export interface Invoice {
  id?: string;
  organizationId: string;
  customerId?: string;
  customerName?: string;
  amount?: number;
  status?: string;
  dueDate?: Date;
  issueDate?: Date;
  items?: any[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getInvoices(organizationId: string): Promise<Invoice[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('invoices').where('organizationId', '==', organizationId).orderBy('issueDate', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice));
}

export async function getInvoiceById(id: string, organizationId: string): Promise<Invoice | null> {
  const db = await ensureDbConnected();
  const doc = await db.collection('invoices').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as Invoice;
  if (data.organizationId !== organizationId) return null;
  return { id: doc.id, ...data };
}

export async function createInvoice(data: Omit<Invoice, 'id'>): Promise<Invoice> {
  const db = await ensureDbConnected();
  const ref = await db.collection('invoices').add({ ...data, createdAt: new Date(), updatedAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updateInvoice(id: string, data: Partial<Invoice>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('invoices').doc(id).update({ ...data, updatedAt: new Date() });
}

export async function deleteInvoice(id: string): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('invoices').doc(id).delete();
}
