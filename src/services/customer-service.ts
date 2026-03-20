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

function toPlain(val) {
  if (!val) return null;
  if (typeof val.toDate === 'function') return val.toDate();
  return val;
}

export async function getCustomers(organizationId?: string): Promise<Customer[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('customers').get();
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: toPlain(data.createdAt),
      updatedAt: toPlain(data.updatedAt),
    } as Customer;
  });
}

export async function getCustomerById(id: string, organizationId: string): Promise<Customer | null> {
  const db = await ensureDbConnected();
  const doc = await db.collection('customers').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toPlain(data.createdAt),
    updatedAt: toPlain(data.updatedAt),
  } as Customer;
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
