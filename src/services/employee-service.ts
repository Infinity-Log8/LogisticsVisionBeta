'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';

export interface Employee {
  id?: string;
  organizationId: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  status?: string;
  startDate?: Date;
  salary?: number;
  createdAt?: Date;
  updatedAt?: Date;
  photoUrl?: string;
  license?: string;
  licenseExpiry?: string;
  totalTrips?: number;
  address?: string;
  emergencyContact?: string;
  bankAccount?: string;
  taxNumber?: string;
  baseSalary?: number;
}

export async function getEmployees(organizationId: string): Promise<Employee[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('employees').where('organizationId', '==', organizationId).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Employee));
}

export async function getEmployeeById(id: string, organizationId: string): Promise<Employee | null> {
  const db = await ensureDbConnected();
  const doc = await db.collection('employees').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as Employee;
  if (data.organizationId !== organizationId) return null;
  return { id: doc.id, ...data };
}

export async function createEmployee(data: Omit<Employee, 'id'>): Promise<Employee> {
  const db = await ensureDbConnected();
  const ref = await db.collection('employees').add({ ...data, createdAt: new Date(), updatedAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('employees').doc(id).update({ ...data, updatedAt: new Date() });
}

export async function deleteEmployee(id: string): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('employees').doc(id).delete();
}

export async function getDrivers(organizationId?: string): Promise<Employee[]> {
  const db = await ensureDbConnected();
  let query: FirebaseFirestore.Query = db.collection('employees').where('role', '==', 'Driver');
  if (organizationId) query = query.where('organizationId', '==', organizationId);
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Employee));
}

