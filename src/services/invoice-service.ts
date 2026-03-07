'use server';

export type InvoiceStatus = 'Paid' | 'Unpaid' | 'Overdue' | 'Draft';
export type InvoiceTaxType = 'exclusive' | 'inclusive' | 'none';

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;

  discount?: number;
  account?: string;
  taxRate?: number;
  item?: string;
}

export interface InvoiceData {
  invoiceNumber?: string;
  customerId?: string;
  customer?: string;
  customerName?: string;
  reference?: string;
  dateIssued?: string;
  dueDate?: string;
  status?: InvoiceStatus;
  taxType?: InvoiceTaxType;
  lineItems?: LineItem[];
  subtotal?: number;
  totalTax?: number;
  total?: number;
  amount?: number;
  notes?: string;
  hasAttachment?: boolean;
  attachmentPath?: string;
  organizationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceWithUrl extends Invoice {
  attachmentUrl?: string;
}

import { ensureDbConnected } from '@/lib/firebase-admin';

export interface Invoice {
  hasAttachment?: boolean;
  attachmentUrl?: string;
  total?: number;
  customer?: string;
  taxAmount?: number;
  subtotalAmount?: number;
  invoiceNumber?: string;
  reference?: string;
  
  id?: string;
  organizationId: string;
  customerId?: string;
  customerName?: string;
  amount?: number;
  status?: InvoiceStatus;
  dueDate?: string | Date;
  issueDate?: string | Date;
  items?: LineItem[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getInvoices(organizationId?: string): Promise<Invoice[]> {
  const db = await ensureDbConnected();
  const query = organizationId
    ? db.collection('invoices').where('organizationId', '==', organizationId).orderBy('issueDate', 'desc')
    : db.collection('invoices').orderBy('issueDate', 'desc');
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice));
}

export async function getInvoiceById(id: string, organizationId?: string): Promise<Invoice | null> {
  const db = await ensureDbConnected();
  const doc = await db.collection('invoices').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as Invoice;
  if (organizationId && data.organizationId !== organizationId) return null;
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
