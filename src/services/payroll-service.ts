'use server';
import { ensureDbConnected } from '@/lib/firebase-admin';
import { generatePayslipId } from '@/lib/generate-id';

export interface PayrollRecord {
  payslipRef?: string; // Human-friendly payslip reference (PAY-YYYYMMDD-XXXX)
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

export async function getPayrollRecords(organizationId?: string): Promise<PayrollRecord[]> {
  const db = await ensureDbConnected();
  const query = organizationId ? db.collection('payroll').where('organizationId', '==', organizationId).orderBy('createdAt', 'desc') : db.collection('payroll').orderBy('createdAt', 'desc');
  const snap = await query.get();
  return snap.docs.map(d => { const data = d.data(); if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate().toISOString(); if (data.processedAt?.toDate) data.processedAt = data.processedAt.toDate().toISOString(); return { id: d.id, ...data } as PayrollRecord; });
}

export async function createPayrollRecord(data: Omit<PayrollRecord, 'id'>): Promise<PayrollRecord> {
  const db = await ensureDbConnected();
  const payslipRef = generatePayslipId();
    const ref = await db.collection('payroll').add({
      payslipRef, ...data, createdAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updatePayrollRecord(id: string, data: Partial<PayrollRecord>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('payroll').doc(id).update(data);
}

// PayrollRun is an alias for PayrollRecord (for compatibility with payroll run views)
export type PayrollRun = PayrollRecord & {
  runDate?: Date;
  totalNetPay?: number;
  totalGrossPay?: number;
  totalDeductions?: number;
  employeeCount?: number;
  notes?: string;
};

export async function getPayrollRunById(id: string, organizationId?: string): Promise<PayrollRun | null> {
  const db = await ensureDbConnected();
  try {
    const doc = await db.collection('payroll').doc(id).get();
    if (!doc.exists) return null;
    const docData = doc.data(); if (docData.createdAt?.toDate) docData.createdAt = docData.createdAt.toDate().toISOString(); if (docData.processedAt?.toDate) docData.processedAt = docData.processedAt.toDate().toISOString(); return { id: doc.id, ...docData } as PayrollRun;
  } catch (error) {
    console.error('Error fetching payroll run:', error);
    return null;
  }
}

// PayrollRunData is an alias for creating/updating a PayrollRun
export type PayrollRunData = Omit<PayrollRun, 'id'>;

export async function createPayrollRun(data: Omit<PayrollRun, 'id'>): Promise<PayrollRun> {
  const db = await ensureDbConnected();
  try {
    const payslipRef = generatePayslipId();
    const ref = await db.collection('payroll').add({
      payslipRef, ...data, createdAt: new Date() });
    return { id: ref.id, ...data };
  } catch (error) {
    console.error('Error creating payroll run:', error);
    throw error;
  }
}

export async function updatePayrollRun(id: string, data: Partial<PayrollRun>): Promise<void> {
  const db = await ensureDbConnected();
  try {
    await db.collection('payroll').doc(id).update({ ...data, updatedAt: new Date() });
  } catch (error) {
    console.error('Error updating payroll run:', error);
    throw error;
  }
}

export async function finalizePayrollRun(id: string): Promise<void> {
  const db = await ensureDbConnected();
  try {
    await db.collection('payroll').doc(id).update({ status: 'finalized', finalizedAt: new Date() });
  } catch (error) {
    console.error('Error finalizing payroll run:', error);
    throw error;
  }
}

// Alias for backward compatibility
export const getPayrollRuns = getPayrollRecords;
