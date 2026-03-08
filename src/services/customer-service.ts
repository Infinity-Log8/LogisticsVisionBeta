'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';

export interface Customer {
  id?: string;
  organizationId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getCustomers(organizationId?: string): Promise<Customer[]> {
  if (!organizationId) return [];

  const db = await ensureDbConnected();
  const snap = await db.collection('customers').where("organizationId", "==", organizationId || "").orderBy('name').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Customer));
}

export async function getCustomerById(id: string, organizationId: string): Promise<Customer | null> {
  const db = await ensureDbConnected();
  const doc = await db.collection('customers').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as Customer;
  if (data.organizationId !== organizationId) return null;
  return { id: doc.id, ...data };
}

export async function createCustomer(data: Omit<Customer, 'id'>): Promise<Customer> {
  const db = await ensureDbConnected();
  const ref = await db.collection('customers').add({ ...data, createdAt: new Date(), updatedAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('customers').doc(id).update({ ...data, updatedAt: new Date() });
}

export async function deleteCustomer(id: string): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('customers').doc(id).delete();
}
