'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';

export interface PayrollRecord {
  id?: string;
  organizationId: string;
  employeeId?: string;
  employeeName?: string;
  baseSalary?: number;
  bonuses?: number;
  deductions?: number;
  netPay?: number;
  period?: string;
  status?: string;
  processedAt?: Date;
  createdAt?: Date;
}

export async function getPayrollRecords(organizationId: string): Promise<PayrollRecord[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('payroll').where('organizationId', '==', organizationId).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PayrollRecord));
}

export async function createPayrollRecord(data: Omit<PayrollRecord, 'id'>): Promise<PayrollRecord> {
  const db = await ensureDbConnected();
  const ref = await db.collection('payroll').add({ ...data, createdAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updatePayrollRecord(id: string, data: Partial<PayrollRecord>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('payroll').doc(id).update(data);
}
